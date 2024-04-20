export async function executeScript({
  tabId,
  script,
}: {
  tabId: number;
  script: string;
}) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [script],
    });

    console.log("script injected");
  } catch (e) {
    console.error("Failed to execute script. ", e);
  }
}
