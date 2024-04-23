import { getActiveTabURL } from "../../../src/utils/get-active-tab-url";
import { executeScript } from "../../../src/utils/execute-script";

describe("Utils", () => {
  it("should returns active tab on getActiveTabURL", async () => {
    jest.spyOn(chrome.tabs, "query").mockResolvedValue([
      {
        id: 3,
        active: true,
        autoDiscardable: false,
        discarded: false,
        groupId: 1,
        highlighted: true,
        incognito: false,
        index: 0,
        pinned: false,
        windowId: 1,
        selected: true,
      },
    ]);

    const tab = await getActiveTabURL();

    expect(tab.id).toBe(3);
  });

  it("should be able to execute script", () => {
    const logSpy = jest.spyOn(console, "log");

    executeScript({ tabId: 123, script: "script" });

    expect(logSpy).toHaveBeenCalledWith("script injected");
  });
});
