const DEFAULT_SETTINGS = {
  backendUrl: "http://localhost:3000",
  licenseKey: "",
  syncedConfig: null,
};

const CONTENT_SCRIPT_ID = "fluentremote-content-script";

async function getSettings() {
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  return {
    backendUrl: String(settings.backendUrl || DEFAULT_SETTINGS.backendUrl).replace(/\/+$/, ""),
    licenseKey: String(settings.licenseKey || ""),
    syncedConfig: settings.syncedConfig || null,
  };
}

async function saveSettings(partial) {
  await chrome.storage.local.set(partial);
}

async function ensureHostPermissions() {
  const origins = ["http://*/*", "https://*/*"];
  const alreadyGranted = await chrome.permissions.contains({ origins });

  if (!alreadyGranted) {
    const granted = await chrome.permissions.request({ origins });
    if (!granted) {
      throw new Error("Site access permission is required to translate text on web pages.");
    }
  }
}

async function registerContentScript() {
  if (chrome.scripting.unregisterContentScripts) {
    try {
      await chrome.scripting.unregisterContentScripts({ ids: [CONTENT_SCRIPT_ID] });
    } catch {
      // Ignore if not registered yet.
    }
  }

  await chrome.scripting.registerContentScripts([
    {
      id: CONTENT_SCRIPT_ID,
      js: ["content-script.js"],
      matches: ["http://*/*", "https://*/*"],
      runAt: "document_idle",
      allFrames: false,
      persistAcrossSessions: true,
    },
  ]);
}

async function bootstrapExtension() {
  const settings = await getSettings();
  const hasOrigins = await chrome.permissions.contains({
    origins: ["http://*/*", "https://*/*"],
  });

  if (settings.licenseKey && hasOrigins) {
    await registerContentScript();
  }
}

async function syncExtensionConfig() {
  const settings = await getSettings();

  if (!settings.licenseKey) {
    throw new Error("Paste your FluentRemote license key first.");
  }

  await ensureHostPermissions();
  await registerContentScript();

  const response = await fetch(`${settings.backendUrl}/api/extension/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      licenseKey: settings.licenseKey,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Unable to sync FluentRemote extension.");
  }

  const syncedConfig = {
    ...payload,
    syncedAt: payload.syncedAt || new Date().toISOString(),
  };

  await saveSettings({ syncedConfig });
  return syncedConfig;
}

async function updateExtensionPreferences({ sourceLanguage, targetLanguage }) {
  const settings = await getSettings();

  if (!settings.licenseKey) {
    throw new Error("Paste your FluentRemote license key first.");
  }

  const response = await fetch(`${settings.backendUrl}/api/extension/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      licenseKey: settings.licenseKey,
      sourceLanguage,
      targetLanguage,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Unable to update extension preferences.");
  }

  const syncedConfig = {
    ...payload,
    syncedAt: payload.syncedAt || new Date().toISOString(),
  };

  await saveSettings({ syncedConfig });
  return syncedConfig;
}

async function translateThroughBackend({ text, mode }) {
  const settings = await getSettings();
  const syncedConfig = settings.syncedConfig || (await syncExtensionConfig());

  const response = await fetch(`${settings.backendUrl}/api/extension/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      licenseKey: settings.licenseKey,
      text,
      mode,
      sourceLanguage: syncedConfig.sourceLanguage,
      targetLanguage: syncedConfig.targetLanguage,
      aiProvider: syncedConfig.aiProvider,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Unable to translate through FluentRemote.");
  }

  return payload;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
    chrome.storage.local.set({
      backendUrl: settings.backendUrl || DEFAULT_SETTINGS.backendUrl,
      licenseKey: settings.licenseKey || DEFAULT_SETTINGS.licenseKey,
      syncedConfig: settings.syncedConfig || DEFAULT_SETTINGS.syncedConfig,
    });
  });

  bootstrapExtension().catch(() => {
    // Ignore bootstrap failures until the user syncs again.
  });
});

chrome.runtime.onStartup.addListener(() => {
  bootstrapExtension().catch(() => {
    // Ignore bootstrap failures until the user syncs again.
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "FLUENTREMOTE_SYNC") {
    syncExtensionConfig()
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({ ok: false, message: error.message }));
    return true;
  }

  if (message?.type === "FLUENTREMOTE_TRANSLATE") {
    translateThroughBackend(message.payload)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({ ok: false, message: error.message }));
    return true;
  }

  if (message?.type === "FLUENTREMOTE_GET_SETTINGS") {
    getSettings()
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({ ok: false, message: error.message }));
    return true;
  }

  if (message?.type === "FLUENTREMOTE_SAVE_SETTINGS") {
    saveSettings(message.payload)
      .then(async () => {
        const data = await getSettings();
        sendResponse({ ok: true, data });
      })
      .catch((error) => sendResponse({ ok: false, message: error.message }));
    return true;
  }

  if (message?.type === "FLUENTREMOTE_OPEN_SETTINGS") {
    getSettings()
      .then((settings) =>
        chrome.tabs.create({
          url: `${settings.backendUrl}/settings`,
        }),
      )
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, message: error.message }));
    return true;
  }

  if (message?.type === "FLUENTREMOTE_OPEN_INSTALL_GUIDE") {
    getSettings()
      .then((settings) =>
        chrome.tabs.create({
          url: `${settings.backendUrl}/install-extension`,
        }),
      )
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, message: error.message }));
    return true;
  }

  if (message?.type === "FLUENTREMOTE_UPDATE_PREFERENCES") {
    updateExtensionPreferences(message.payload)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({ ok: false, message: error.message }));
    return true;
  }

  return false;
});
