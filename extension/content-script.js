const STATE = {
  actionPill: null,
  tooltip: null,
  selectedText: "",
  selectedRect: null,
  lastEditableSelection: null,
};

function removeElement(element) {
  if (element?.parentNode) {
    element.parentNode.removeChild(element);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function positionFloatingCard(element, rect, fallbackHeight) {
  const margin = 12;
  const width = element.offsetWidth || 320;
  const height = element.offsetHeight || fallbackHeight;
  const left = clamp(
    rect.left,
    margin,
    Math.max(margin, window.innerWidth - width - margin),
  );

  const aboveTop = rect.top - height - 14;
  const top =
    aboveTop >= margin
      ? aboveTop
      : clamp(
          rect.bottom + 14,
          margin,
          Math.max(margin, window.innerHeight - height - margin),
        );

  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
}

function clearUi() {
  removeElement(STATE.actionPill);
  removeElement(STATE.tooltip);
  STATE.actionPill = null;
  STATE.tooltip = null;
}

function isEditableTarget(target) {
  if (!target) return false;
  return (
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLInputElement &&
      /^(text|search|url|tel|email|password)$/i.test(target.type)) ||
    target.isContentEditable
  );
}

function captureEditableSelection(target) {
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
    if (
      typeof target.selectionStart !== "number" ||
      typeof target.selectionEnd !== "number" ||
      target.selectionStart === target.selectionEnd
    ) {
      return null;
    }

    return {
      type: "input",
      element: target,
      start: target.selectionStart,
      end: target.selectionEnd,
    };
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  if (selection.isCollapsed) return null;

  let node = selection.anchorNode;
  let editableRoot = null;

  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.isContentEditable) {
      editableRoot = node;
      break;
    }

    if (
      node.nodeType === Node.ELEMENT_NODE &&
      typeof node.closest === "function"
    ) {
      editableRoot = node.closest('[contenteditable=""], [contenteditable="true"]');
      if (editableRoot) break;
    }

    node = node.parentNode;
  }

  if (!editableRoot && isEditableTarget(target) && target.isContentEditable) {
    editableRoot = target;
  }

  if (!editableRoot) return null;

  return {
    type: "contenteditable",
    range: selection.getRangeAt(0).cloneRange(),
    element: editableRoot || target,
  };
}

function replaceEditableSelection(translatedText) {
  const selectionState = STATE.lastEditableSelection;
  if (!selectionState) return;

  if (selectionState.type === "input") {
    const element = selectionState.element;
    const value = element.value;
    element.value =
      value.slice(0, selectionState.start) +
      translatedText +
      value.slice(selectionState.end);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.focus();
    element.setSelectionRange(
      selectionState.start,
      selectionState.start + translatedText.length,
    );
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  const selection = window.getSelection();
  if (!selection) return;
  const element = selectionState.element;
  selection.removeAllRanges();
  selection.addRange(selectionState.range);
  selectionState.range.deleteContents();
  const textNode = document.createTextNode(translatedText);
  selectionState.range.insertNode(textNode);

  const nextRange = document.createRange();
  nextRange.setStartAfter(textNode);
  nextRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(nextRange);

  if (element) {
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: translatedText,
      }),
    );
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.focus();
  }
}

function createBaseCard() {
  const card = document.createElement("div");
  card.style.position = "fixed";
  card.style.zIndex = "2147483647";
  card.style.maxWidth = "320px";
  card.style.border = "1px solid rgba(148, 163, 184, 0.28)";
  card.style.borderRadius = "20px";
  card.style.background = "rgba(255,255,255,0.96)";
  card.style.backdropFilter = "blur(14px)";
  card.style.boxShadow = "0 24px 60px rgba(15,23,42,0.18)";
  card.style.padding = "14px";
  card.style.fontFamily = "ui-sans-serif, system-ui, sans-serif";
  card.style.color = "#0f172a";
  return card;
}

function showMessageTooltip(message, options = {}) {
  removeElement(STATE.tooltip);
  const card = createBaseCard();
  card.style.width = "min(320px, calc(100vw - 24px))";

  const title = document.createElement("div");
  title.textContent = options.title || "FluentRemote";
  title.style.fontSize = "11px";
  title.style.fontWeight = "700";
  title.style.letterSpacing = "0.18em";
  title.style.textTransform = "uppercase";
  title.style.color = options.tone === "warning" ? "#b45309" : "#2563eb";

  const body = document.createElement("div");
  body.textContent = message;
  body.style.marginTop = "10px";
  body.style.fontSize = "14px";
  body.style.lineHeight = "1.7";
  body.style.color = options.tone === "warning" ? "#92400e" : "#334155";

  card.appendChild(title);
  card.appendChild(body);

  document.body.appendChild(card);
  const rect = STATE.selectedRect || {
    left: 20,
    top: 20,
    bottom: 20,
  };
  positionFloatingCard(card, rect, 180);
  STATE.tooltip = card;
}

function showTranslationTooltip(translatedText, canReplace) {
  removeElement(STATE.tooltip);
  const card = createBaseCard();
  card.style.width = canReplace
    ? "min(340px, calc(100vw - 24px))"
    : "min(360px, calc(100vw - 24px))";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "flex-start";
  header.style.justifyContent = "space-between";
  header.style.gap = "12px";

  const labelWrap = document.createElement("div");
  const brand = document.createElement("div");
  brand.textContent = "FluentRemote";
  brand.style.fontSize = "11px";
  brand.style.fontWeight = "700";
  brand.style.letterSpacing = "0.18em";
  brand.style.textTransform = "uppercase";
  brand.style.color = "#2563eb";

  const subtitle = document.createElement("div");
  subtitle.textContent = canReplace ? "Draft ready to replace" : "Instant translation";
  subtitle.style.marginTop = "4px";
  subtitle.style.fontSize = "11px";
  subtitle.style.fontWeight = "700";
  subtitle.style.letterSpacing = "0.16em";
  subtitle.style.textTransform = "uppercase";
  subtitle.style.color = "#64748b";

  labelWrap.appendChild(brand);
  labelWrap.appendChild(subtitle);
  header.appendChild(labelWrap);

  if (canReplace) {
    const replaceButton = document.createElement("button");
    replaceButton.type = "button";
    replaceButton.textContent = "Replace";
    replaceButton.style.border = "1px solid rgba(16,185,129,0.24)";
    replaceButton.style.background = "rgba(236,253,245,0.95)";
    replaceButton.style.color = "#047857";
    replaceButton.style.borderRadius = "999px";
    replaceButton.style.padding = "8px 12px";
    replaceButton.style.fontSize = "12px";
    replaceButton.style.fontWeight = "700";
    replaceButton.style.cursor = "pointer";
    replaceButton.addEventListener("click", () => {
      replaceEditableSelection(translatedText);
      clearUi();
    });
    header.appendChild(replaceButton);
  }

  const body = document.createElement("div");
  body.textContent = translatedText;
  body.style.marginTop = "12px";
  body.style.borderRadius = "14px";
  body.style.background = canReplace ? "#ecfdf5" : "#eff6ff";
  body.style.padding = "12px 14px";
  body.style.fontSize = canReplace ? "15px" : "14px";
  body.style.lineHeight = canReplace ? "1.7" : "1.75";
  body.style.color = canReplace ? "#065f46" : "#0f172a";
  if (!canReplace) {
    body.style.maxHeight = "min(46vh, 420px)";
    body.style.overflowY = "auto";
    body.style.paddingRight = "10px";
    body.style.whiteSpace = "pre-wrap";
    body.style.scrollbarWidth = "thin";
  }

  card.appendChild(header);
  card.appendChild(body);

  document.body.appendChild(card);
  const rect = STATE.selectedRect || {
    left: 20,
    top: 20,
    bottom: 20,
  };
  positionFloatingCard(card, rect, 220);
  STATE.tooltip = card;
}

function showActionPill(rect, canReplace) {
  removeElement(STATE.actionPill);

  const pill = document.createElement("button");
  pill.type = "button";
  pill.textContent = canReplace ? "Translate / Replace" : "Translate";
  pill.style.position = "fixed";
  pill.style.zIndex = "2147483647";
  pill.style.left = `${Math.min(rect.left, window.innerWidth - (canReplace ? 194 : 128))}px`;
  pill.style.top = `${Math.max(12, rect.top - 42)}px`;
  pill.style.border = "1px solid rgba(59,130,246,0.18)";
  pill.style.borderRadius = "999px";
  pill.style.padding = canReplace ? "10px 14px" : "9px 13px";
  pill.style.background = "linear-gradient(135deg, rgba(15,98,254,0.98), rgba(37,99,235,0.94))";
  pill.style.color = "#ffffff";
  pill.style.fontSize = "12px";
  pill.style.fontWeight = "700";
  pill.style.letterSpacing = "0.04em";
  pill.style.backdropFilter = "blur(10px)";
  pill.style.boxShadow = "0 14px 34px rgba(15,98,254,0.24)";
  pill.style.cursor = "pointer";
  pill.style.transition = "transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease";

  pill.addEventListener("mouseenter", () => {
    pill.style.transform = "translateY(-1px)";
    pill.style.boxShadow = "0 18px 40px rgba(15,98,254,0.28)";
  });

  pill.addEventListener("mouseleave", () => {
    pill.style.transform = "translateY(0)";
    pill.style.boxShadow = "0 14px 34px rgba(15,98,254,0.24)";
  });

  pill.addEventListener("click", async () => {
    showMessageTooltip("Translating...", { title: "FluentRemote" });

    try {
      const response = await chrome.runtime.sendMessage({
        type: "FLUENTREMOTE_TRANSLATE",
        payload: {
          text: STATE.selectedText,
          mode: canReplace ? "write" : "read",
        },
      });

      if (!response?.ok) {
        showMessageTooltip(response?.message || "Unable to translate right now.", {
          title: "Action required",
          tone: "warning",
        });
        return;
      }

      showTranslationTooltip(response.data.translatedText, canReplace);
    } catch (err) {
      showMessageTooltip(
        err instanceof Error ? err.message : "Unable to translate right now.",
        { title: "Error", tone: "warning" },
      );
    }
  });

  document.body.appendChild(pill);
  STATE.actionPill = pill;
}

function handleSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    clearUi();
    return;
  }

  const text = selection.toString().trim();
  if (!text) {
    clearUi();
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || rect.width === 0 && rect.height === 0) {
    clearUi();
    return;
  }

  STATE.selectedText = text;
  STATE.selectedRect = rect;
  STATE.lastEditableSelection = captureEditableSelection(document.activeElement);

  showActionPill(rect, Boolean(STATE.lastEditableSelection));
}

document.addEventListener("mouseup", () => {
  window.setTimeout(handleSelection, 20);
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    clearUi();
    return;
  }

  window.setTimeout(handleSelection, 20);
});

document.addEventListener("mousedown", (event) => {
  const target = event.target;
  if (
    STATE.actionPill?.contains(target) ||
    STATE.tooltip?.contains(target)
  ) {
    return;
  }

  clearUi();
});
