import { mockServerDataReturn } from "../service/api.ts";
import { executeScript } from "../utils/execute-script.ts";

let linkedinTabId: number;

chrome.webNavigation.onDOMContentLoaded.addListener((tab) => {
  if (tab.url?.includes("linkedin.com")) {
    linkedinTabId = tab.tabId;
  }
});

chrome.tabs.onUpdated.addListener((tabId) => {
  if (tabId === linkedinTabId) {
    mockServerDataReturn().then(({ classes, javascriptFile }) => {
      chrome.tabs.sendMessage(tabId, {
        type: "INIT",
        data: classes,
        javascriptFile,
      });

      executeScript({
        tabId,
        script: javascriptFile,
      });
    });
  }
});

chrome.runtime.onMessage.addListener((obj) => {
  const { type } = obj;

  if (type === "REFRESH") {
    chrome.tabs.reload(linkedinTabId);
  }
});
