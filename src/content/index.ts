import "@webcomponents/webcomponentsjs";

import { ExtensionAddon } from "../components/ExtensionAddon.ts";
import { LinkedinClasses } from "../service/api.ts";

let linkedinMainContainerSelector: string,
  linkedinEditorClassName: string,
  linkedinNewPostSelector: string,
  linkedinSendNewPostButtonSelector: string,
  linkedinSendCommentaryButtonSelector: string;

chrome.runtime.onMessage.addListener(
  (obj: { type: string; data: LinkedinClasses }) => {
    const { type, data } = obj;

    if (type === "INIT" && window.location.href.includes("linkedin.com/feed")) {
      linkedinMainContainerSelector = data.linkedinMainContainerSelector;
      linkedinEditorClassName = data.linkedinEditorClassName;
      linkedinNewPostSelector = data.linkedinNewPostSelector;
      linkedinSendNewPostButtonSelector =
        data.linkedinSendNewPostButtonSelector;
      linkedinSendCommentaryButtonSelector =
        data.linkedinSendCommentaryButtonSelector;

      init();
    }
  }
);

function init() {
  defineCustomElements();

  if (!document.querySelector("extension-addon")) {
    injectHtmlSessionIntoHtmlDOM();
  }
}

function injectHtmlSessionIntoHtmlDOM() {
  const mainEl = document.querySelector(linkedinMainContainerSelector);

  if (mainEl) {
    mainEl.prepend(createCustomElement());
  }
}

function createCustomElement() {
  const element = document.createElement("extension-addon");
  element.setAttribute("editor-class-name", linkedinEditorClassName);
  element.setAttribute("new-post-selector", linkedinNewPostSelector);
  element.setAttribute(
    "send-new-post-btn-selector",
    linkedinSendNewPostButtonSelector
  );
  element.setAttribute(
    "send-commentary-btn-selector",
    linkedinSendCommentaryButtonSelector
  );

  return element;
}

function defineCustomElements() {
  if (!customElements.get("extension-addon")) {
    customElements.define("extension-addon", ExtensionAddon);
  }
}
