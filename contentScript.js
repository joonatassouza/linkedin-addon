(() => {
  const linkedinEditorClassName = "ql-editor";
  const linkedinMainContainerSelector = "main.scaffold-layout__main";
  const linkedinNewPostSelector = ".share-box-feed-entry__trigger";
  const linkedinSendNewPostButtonSelector = ".share-actions__primary-action";
  const linkedinSendCommentaryButtonSelector =
    ".comments-comment-box__submit-button";

  let hasText = false;
  let hasInputAvailable = false;
  let inputEl, sendButton, clearButton, saveButton, refreshButton;

  chrome.runtime.onMessage.addListener((obj) => {
    const { type } = obj;

    if (type === "INIT") {
      init();
    }
  });

  function initComponents() {
    inputEl = document.getElementsByClassName("vengresso-linkedin-input")[0];
    sendButton = document.getElementsByClassName(
      "vengresso-linkedin-send-button"
    )[0];
    clearButton = document.getElementsByClassName(
      "vengresso-linkedin-clear-button"
    )[0];
    saveButton = document.getElementsByClassName(
      "vengresso-linkedin-save-button"
    )[0];
    refreshButton = document.getElementsByClassName(
      "vengresso-linkedin-refresh-button"
    )[0];

    inputEl.addEventListener("input", () => {
      hasText = inputEl.value.trim() !== "";
      updateButtonStates();
    });

    sendButton.addEventListener("click", sendTextToLinkedinInput);
    clearButton.addEventListener("click", clearInput);
    saveButton.addEventListener("click", saveTextToLocalStorage);
    refreshButton.addEventListener("click", refreshPage);

    updateButtonStates();
  }

  function injectHtmlSessionIntoHtmlDOM() {
    const section = document.createElement("section");
    section.className = "vengresso-linkedin-section";
    section.innerHTML = `<section class="vengresso-linkedin-section">
          <main>
          <input class="vengresso-linkedin-input" type="text" />
          <div class="vengresso-linkedin-buttons">
              <button class="vengresso-linkedin-send-button">
              Send
              </button>
              <button class="vengresso-linkedin-clear-button">
              Clear
              </button>
              <button class="vengresso-linkedin-save-button">
              Save
              </button>
              <button class="vengresso-linkedin-refresh-button">
              Refresh
              </button>
          </div>
          </main>
          <footer class="vengresso-linkedin-section-foooter">
          <section class="vengresso-linkedin-section-hr"></section>
          <em class="vengresso-linkedin-section-foooter-powered-by"
              >Powered by: Jonatas</em
          >
          </footer>
          </section>
      `;

    // injecting created elements into main session of linkedin
    const mainEl = document.querySelector(linkedinMainContainerSelector);
    mainEl.prepend(section);
  }

  function observeDOMMutations() {
    function handleDOMChanges(mutationsList) {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.classList?.contains(linkedinEditorClassName)) {
              hasInputAvailable = true;
            }
          });
        }
      });
    }

    const observer = new MutationObserver(handleDOMChanges);

    const observerConfig = {
      childList: true,
      subtree: true,
    };

    observer.observe(document.body, observerConfig);

    function removeListenersAndDisconnectObserver() {
      observer.disconnect();
    }

    window.addEventListener(
      "beforeunload",
      removeListenersAndDisconnectObserver
    );
  }

  function updateButtonStates() {
    sendButton.disabled = !hasText;
    clearButton.disabled = !hasText;
    saveButton.disabled = !hasText;
  }

  function sendTextToInput(element, text, buttonClassname) {
    element.innerText = "";
    let count = -1;
    let interval = setInterval(() => {
      count++;
      if (count > text.length) {
        setTimeout(() => {
          const sendButtonElement = document.querySelector(buttonClassname);

          if (sendButtonElement) {
            sendButtonElement.click();
            element.innerText = "";
          }
        }, 1000);

        clearInput();
        clearInterval(interval);
        return;
      }

      element.innerText = String(text).substring(0, count);
    }, 50);
  }

  function createNewLinkedinPost(text) {
    document.querySelector(linkedinNewPostSelector).click();

    let waitingTime = 10; // seconds - Waiting time for new post modal shows up
    const interval = setInterval(() => {
      if (waitingTime === 0) {
        clearInterval(interval);
        alert("Failed to create new post");
        return;
      }

      if (hasInputAvailable) {
        const inputNewPost = document.querySelector(
          "." + linkedinEditorClassName
        );
        sendTextToInput(inputNewPost, text, linkedinSendNewPostButtonSelector);
        clearInterval(interval);
      } else {
        waitingTime--;
      }
    }, 1000);
  }

  function sendTextToLinkedinInput() {
    const text = inputEl.value;
    const inputComment = document.querySelector("." + linkedinEditorClassName);
    hasInputAvailable = !!inputComment;
    if (hasInputAvailable) {
      sendTextToInput(inputComment, text, linkedinSendCommentaryButtonSelector);
    } else {
      createNewLinkedinPost(text);
    }
  }

  function clearInput() {
    inputEl.value = "";
    hasText = false;
    updateButtonStates();
  }

  function saveTextToLocalStorage() {
    const text = inputEl.value.trim();

    window.localStorage.setItem("@vengresso|savedText", text);

    chrome.storage.sync.set(
      {
        "@vengresso|savedText": text,
      },
      function () {
        alert("Saved to localStorage");
      }
    );

    clearInput();
  }

  function refreshPage() {
    chrome.runtime.sendMessage({ type: "REFRESH" });
  }

  function init() {
    injectHtmlSessionIntoHtmlDOM();
    initComponents();
    observeDOMMutations();
  }

  init();
})();
