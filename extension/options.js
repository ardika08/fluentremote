const backendUrlInput = document.getElementById("backendUrl");
const licenseKeyInput = document.getElementById("licenseKey");
const saveButton = document.getElementById("saveButton");
const syncButton = document.getElementById("syncButton");
const messageBox = document.getElementById("message");

function showMessage(text, tone = "info") {
  messageBox.textContent = text;
  messageBox.classList.remove("hidden", "error");
  if (tone === "error") {
    messageBox.classList.add("error");
  }
}

function hideMessage() {
  messageBox.textContent = "";
  messageBox.classList.add("hidden");
  messageBox.classList.remove("error");
}

async function loadOptions() {
  const response = await chrome.runtime.sendMessage({
    type: "FLUENTREMOTE_GET_SETTINGS",
  });

  if (!response?.ok) {
    showMessage(response?.message || "Unable to load extension options.", "error");
    return;
  }

  backendUrlInput.value = response.data.backendUrl || "http://localhost:3000";
  licenseKeyInput.value = response.data.licenseKey
    ? maskLicenseKey(response.data.licenseKey)
    : "";
}

async function saveOptions() {
  hideMessage();
  const response = await chrome.runtime.sendMessage({
    type: "FLUENTREMOTE_SAVE_SETTINGS",
    payload: {
      backendUrl: backendUrlInput.value.trim(),
      licenseKey: licenseKeyInput.value.trim(),
    },
  });

  if (!response?.ok) {
    showMessage(response?.message || "Unable to save extension settings.", "error");
    return;
  }

  showMessage("Extension settings saved.");
}

async function syncOptions() {
  hideMessage();
  await saveOptions();
  const response = await chrome.runtime.sendMessage({
    type: "FLUENTREMOTE_SYNC",
  });

  if (!response?.ok) {
    showMessage(response?.message || "Unable to sync extension.", "error");
    return;
  }

  showMessage("Extension synced successfully.");
}

saveButton.addEventListener("click", saveOptions);
syncButton.addEventListener("click", syncOptions);

loadOptions();
