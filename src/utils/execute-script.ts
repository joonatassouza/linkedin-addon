export async function executeScript({
  tabId,
  script,
}: {
  tabId: number;
  script: string;
}) {
  try {
    // chrome.tabs.executeScript(tabId, {
    //   code: `document.body.appendChild(document.createElement('script')).src = 'https://example.com/script.js';`,
    // });
    console.log("script injected");
  } catch (e) {
    console.error("Failed to execute script. ", e);
  }
}
