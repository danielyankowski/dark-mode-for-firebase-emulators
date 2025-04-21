// Content script for darkmode in Firebase Emulator UI
// If I were the mayor, I'd hand you the key to darkness
console.log("Darkmode content script launched!");

declare const chrome:
  | {
      runtime?: {
        onMessage: { addListener: (cb: (msg: unknown) => void) => void };
      };
    }
  | undefined;

const style = document.createElement("style");
style.id = "firebase-darkmode-style";
style.innerHTML = `
  html, body {
    background: #18181b !important;
    color: #e5e5e5 !important;
  }
  .mdc-theme--background, .mdc-theme--surface, .App, .AppBar, .Firestore, .Firestore-PanelHeader, .Firestore-Collection, .Firestore-Document, .Firestore-panels-wrapper, .Firestore-panels, .Firestore-PanelHeader, .Firestore-CollectionList, .Firestore-Document-List, .Firestore-Field-List, .Firestore-actions, .Firestore-sub-tabs, .Firestore-main, .mdc-layout-grid__cell, .mdc-card, .mdc-elevation--z2 {
    background: #23272e !important;
    color: #e5e5e5 !important;
    border-color: #333 !important;
  }
  .mdc-top-app-bar, .AppBar, .AppBar-title-row, .AppBar-logo-lockup {
    background: #18181b !important;
    color: #e5e5e5 !important;
  }
  .mdc-button, .mdc-tab, .mdc-list-item, .mdc-icon-button, .mdc-menu, .mdc-menu-surface, .mdc-list, .mdc-list--dense {
    background: #23272e !important;
    color: #e5e5e5 !important;
    border-color: #333 !important;
  }
  .mdc-button__label, .mdc-tab__text-label, .mdc-list-item__text, .Firestore-PanelHeader-title, .Firestore-PanelHeader-icon, .Firestore-PanelHeader {
    color: #e5e5e5 !important;
  }
  .Firestore-List-Item.mdc-list-item--activated {
    color: #f3f4f6 !important;
  }
  .BreadCrumbs-crumb.BreadCrumbs-link, .BreadCrumbs-crumb.BreadCrumbs-link a {
    color: #e5e5e5 !important;
  }
  .BreadCrumbs-crumb.BreadCrumbs-link:hover {
    color: #f3f4f6 !important;
  }
  .mdc-theme--primary, .mdc-theme--on-primary, .mdc-theme--secondary, .mdc-theme--on-secondary {
    color: #a78bfa !important;
  }
  .mdc-theme--background, .mdc-theme--surface {
    background: #23272e !important;
  }
  .mdc-list-divider {
    border-color: #333 !important;
  }
  input, textarea, select {
    background: #18181b !important;
    color: #e5e5e5 !important;
    border-color: #333 !important;
  }
  ::selection {
    background: #a78bfa !important;
    color: #18181b !important;
  }
`;

function enableDarkmode() {
  if (!document.getElementById("firebase-darkmode-style")) {
    document.head.appendChild(style);
  }
}

function disableDarkmode() {
  const el = document.getElementById("firebase-darkmode-style");
  if (el) el.remove();
}

enableDarkmode();

(chrome as any)?.runtime?.onMessage.addListener((msg: unknown) => {
  if (typeof msg === "object" && msg !== null && "type" in msg) {
    const m = msg as { type: string; enabled?: boolean };
    if (m.type === "TOGGLE_DARKMODE") {
      if (m.enabled) {
        enableDarkmode();
      } else {
        disableDarkmode();
      }
    }
  }
});
