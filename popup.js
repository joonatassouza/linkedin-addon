import { getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  getActiveTabURL().then((activeTab) => {
    if (!activeTab.url.includes("linkedin.com/feed")) {
      const container = document.getElementsByClassName("container")[0];

      container.innerHTML =
        '<div class="title">This is not a linkedin feed page.</div>';
    }
  });
});
