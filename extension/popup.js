const licenseKeyInput = document.getElementById("licenseKey");
const syncButton = document.getElementById("syncButton");
const openSettingsButton = document.getElementById("openSettingsButton");
const openGuideButton = document.getElementById("openGuideButton");
const swapLanguagesButton = document.getElementById("swapLanguagesButton");
const messageBox = document.getElementById("message");
const statusCard = document.getElementById("statusCard");
const licenseStatus = document.getElementById("licenseStatus");
const providerPill = document.getElementById("providerPill");
const languagePair = document.getElementById("languagePair");
const providerReady = document.getElementById("providerReady");

function maskLicenseKey(value) {
  const compact = String(value || "").replace(/[^A-Za-z0-9]/g, "");
  if (compact.length <= 8) {
    return value || "";
  }

  return `${compact.slice(0, 4)}••••${compact.slice(-4)}`;
}

function showMessage(text, tone = "info") {
  messageBox.textContent = text;
  messageBox.classList.remove("hidden", "error");
  if (tone === "error") {
    messageBox.classList.add("error");
  }
}

function hideMessage() {
  messageBox.classList.add("hidden");
  messageBox.textContent = "";
  messageBox.classList.remove("error");
}

function resetLicenseFieldForResync() {
  licenseKeyInput.value = "";
  licenseKeyInput.dataset.hasStoredKey = "false";
}

function setBusyState(isBusy, label = "Sinkronkan ekstensi") {
  syncButton.disabled = isBusy;
  openSettingsButton.disabled = isBusy;
  openGuideButton.disabled = isBusy;
  if (swapLanguagesButton) {
    swapLanguagesButton.disabled = isBusy;
  }
  syncButton.textContent = isBusy ? "Syncing..." : label;
}

function renderSyncedConfig(syncedConfig) {
  if (!syncedConfig) {
    statusCard.classList.add("hidden");
    return;
  }

  statusCard.classList.remove("hidden");
  licenseStatus.textContent = syncedConfig.licenseStatus || "Active";
  providerPill.textContent =
    syncedConfig.aiProvider === "maia_router" ? "MAIA Router" : "OpenAI";
  languagePair.textContent = `${syncedConfig.sourceLanguage} → ${syncedConfig.targetLanguage}`;
  providerReady.textContent = syncedConfig.hasProviderKeys
    ? "Siap"
    : "API key belum diisi di Pengaturan";
}

async function loadStoredSettings() {
  const response = await chrome.runtime.sendMessage({
    type: "FLUENTREMOTE_GET_SETTINGS",
  });

  if (!response?.ok) {
    throw new Error(response?.message || "Gagal memuat pengaturan ekstensi.");
  }

  return response.data;
}

async function loadPopup() {
  try {
    const settings = await loadStoredSettings();
    // Show masked key — never expose raw license key in UI
    if (settings.licenseKey) {
      licenseKeyInput.value = maskLicenseKey(settings.licenseKey);
      licenseKeyInput.dataset.hasStoredKey = "true";
    } else {
      licenseKeyInput.value = "";
    }
    // Render cached config immediately — no network call on open
    renderSyncedConfig(settings.syncedConfig);
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Gagal memuat pengaturan ekstensi.",
      "error",
    );
  }
}

async function syncExtension() {
  hideMessage();
  setBusyState(true);

  try {
    const rawValue = licenseKeyInput.value.trim();
    const hasStoredKey = licenseKeyInput.dataset.hasStoredKey === "true";
    if (!rawValue && !hasStoredKey) {
      throw new Error("Tempelkan kode lisensi FluentRemote terlebih dahulu.");
    }

    if (!hasStoredKey || rawValue.includes("-")) {
      await chrome.runtime.sendMessage({
        type: "FLUENTREMOTE_SAVE_SETTINGS",
        payload: {
          licenseKey: rawValue,
        },
      });
    }

    const response = await chrome.runtime.sendMessage({
      type: "FLUENTREMOTE_SYNC",
    });

    if (!response?.ok) {
      const syncMessage = response?.message || "Gagal menyinkronkan ekstensi.";
      if (
        syncMessage.includes("not valid") ||
        syncMessage.includes("revoked") ||
        syncMessage.includes("not attached")
      ) {
        resetLicenseFieldForResync();
        throw new Error(
          "Kode lisensi ini sudah tidak berlaku. Salin kode terbaru dari Pengaturan FluentRemote Web, lalu sinkronkan ulang.",
        );
      }

      throw new Error(syncMessage);
    }

    renderSyncedConfig(response.data);

    const stored = await loadStoredSettings();
    licenseKeyInput.value = maskLicenseKey(stored.licenseKey || rawValue);
    licenseKeyInput.dataset.hasStoredKey = "true";

    showMessage("Ekstensi tersinkron. Sorot teks di halaman chat untuk mulai menerjemahkan.");
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Gagal menyinkronkan ekstensi.",
      "error",
    );
  } finally {
    setBusyState(false);
  }
}

async function swapLanguages() {
  hideMessage();
  setBusyState(true, "Sync extension");

  try {
    const settings = await loadStoredSettings();
    const syncedConfig = settings.syncedConfig;

    if (!settings.licenseKey || !syncedConfig) {
      throw new Error("Sinkronkan ekstensi terlebih dahulu.");
    }

    const response = await chrome.runtime.sendMessage({
      type: "FLUENTREMOTE_UPDATE_PREFERENCES",
      payload: {
        sourceLanguage: syncedConfig.targetLanguage,
        targetLanguage: syncedConfig.sourceLanguage,
      },
    });

    if (!response?.ok) {
      throw new Error(response?.message || "Gagal menukar pasangan bahasa.");
    }

    renderSyncedConfig(response.data);
    showMessage("Pasangan bahasa diperbarui.");
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Gagal menukar pasangan bahasa.",
      "error",
    );
  } finally {
    setBusyState(false);
  }
}

licenseKeyInput.addEventListener("focus", () => {
  if (licenseKeyInput.dataset.hasStoredKey === "true") {
    licenseKeyInput.value = "";
    licenseKeyInput.dataset.hasStoredKey = "false";
  }
});

syncButton.addEventListener("click", syncExtension);
openSettingsButton.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "FLUENTREMOTE_OPEN_SETTINGS" });
});
openGuideButton.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({
    type: "FLUENTREMOTE_OPEN_INSTALL_GUIDE",
  });
});
swapLanguagesButton?.addEventListener("click", swapLanguages);

loadPopup();
