let linkedinTabId;

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url?.includes("linkedin.com/feed")) {
    linkedinTabId = tabId;
    chrome.tabs.sendMessage(tabId, {
      type: "INIT",
    });
  }
});

chrome.runtime.onMessage.addListener((obj) => {
  const { type } = obj;

  if (type === "REFRESH") {
    chrome.tabs.reload(linkedinTabId);
  }
});
