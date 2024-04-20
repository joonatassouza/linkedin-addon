import { getActiveTabURL } from "../utils/get-active-tab-url.ts";

document.addEventListener("DOMContentLoaded", () => {
  getActiveTabURL().then((activeTab) => {
    if (!activeTab.url?.includes("linkedin.com/feed")) {
      const container = document.getElementsByClassName("container")[0];

      container.innerHTML =
        '<div class="title">This is not a valid linkedin feed page.</div>';
    }
  });
});
