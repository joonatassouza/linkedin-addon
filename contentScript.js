class ExtensionAddon extends HTMLElement {
  hasText = false;
  hasInputAvailable = false;
  inputEl;
  sendButton;
  clearButton;
  saveButton;
  refreshButton;

  constructor() {
    super();
    this.build();
    this.addListeners();
    this.updateButtonStates();
  }

  static get observedAttributes() {
    return [
      "editor-class-name",
      "new-post-selector",
      "send-new-post-btn-selector",
      "send-commentary-btn-selector",
    ];
  }

  get editorClassName() {
    return this.getAttribute("editor-class-name");
  }

  get newPostSelector() {
    return this.getAttribute("new-post-selector");
  }

  get sendNewPostBtnSelector() {
    return this.getAttribute("send-new-post-btn-selector");
  }

  get sendCommentaryBtnSelector() {
    return this.getAttribute("send-commentary-btn-selector");
  }

  initComponents() {
    this.inputEl = document.createElement("input");
    this.inputEl.className = "vengresso-linkedin-input";
    this.inputEl.setAttribute("type", "text");
    this.inputEl.setAttribute("placeholder", "What's your thoughts?");
    this.inputEl.addEventListener("input", () => {
      this.hasText = this.inputEl.value.trim() !== "";
      this.updateButtonStates();
    });

    this.sendButton = document.createElement("button");
    this.sendButton.setAttribute("type", "button");
    this.sendButton.className = "vengresso-linkedin-send-button";
    this.sendButton.innerText = "Send";
    this.sendButton.addEventListener("click", () => {
      this.sendTextToLinkedinInput();
    });

    this.clearButton = document.createElement("button");
    this.clearButton.setAttribute("type", "button");
    this.clearButton.className = "vengresso-linkedin-clear-button";
    this.clearButton.innerText = "Clear";
    this.clearButton.addEventListener("click", () => {
      this.clearInput();
    });

    this.saveButton = document.createElement("button");
    this.saveButton.setAttribute("type", "button");
    this.saveButton.className = "vengresso-linkedin-save-button";
    this.saveButton.innerText = "Save";
    this.saveButton.addEventListener("click", () => {
      this.saveTextToLocalStorage();
    });

    this.refreshButton = document.createElement("button");
    this.refreshButton.setAttribute("type", "button");
    this.refreshButton.className = "vengresso-linkedin-refresh-button";
    this.refreshButton.innerText = "Refresh";
    this.refreshButton.addEventListener("click", this.refreshPage);
  }

  updateButtonStates() {
    this.sendButton.disabled = !this.hasText;
    this.clearButton.disabled = !this.hasText;
    this.saveButton.disabled = !this.hasText;
  }

  clearInput() {
    this.inputEl.value = "";
    this.hasText = false;
    this.updateButtonStates();
  }

  saveTextToLocalStorage() {
    const text = this.inputEl.value.trim();
    try {
      if (chrome?.storage?.sync) {
        chrome.storage.sync.set({ "@vengresso|savedText": text }).then(() => {
          console.log(text + " saved to sync storage");
        });
      } else {
        localStorage.setItem("@vengresso|savedText", text);
        console.log(text + " saved to local storage");
      }
    } catch {
      console.log("Save text failure");
    } finally {
      this.clearInput();
    }
  }

  refreshPage() {
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: "REFRESH" });
    } else {
      window.location.reload();
    }
  }

  addListeners() {
    // check if input from new post modal is ready
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.classList?.contains(this.editorClassName)) {
              this.hasInputAvailable = true;
            }
          });
        }
      });
    });

    const observerConfig = {
      childList: true,
      subtree: true,
    };

    observer.observe(document.body, observerConfig);

    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  }

  build() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.appendChild(this.styles());

    const section = document.createElement("section");
    section.className = "vengresso-linkedin-section";

    const main = document.createElement("main");

    const buttons = document.createElement("div");
    buttons.className = "vengresso-linkedin-buttons";

    this.initComponents();

    const footer = document.createElement("footer");
    footer.className = "vengresso-linkedin-section-foooter";
    footer.innerHTML = `
      <section class="vengresso-linkedin-section-hr"></section>
      <em class="vengresso-linkedin-section-foooter-powered-by"
        >Powered by: Jonatas</em
      >
    `;

    buttons.appendChild(this.sendButton);
    buttons.appendChild(this.clearButton);
    buttons.appendChild(this.saveButton);
    buttons.appendChild(this.refreshButton);

    main.appendChild(this.inputEl);
    main.appendChild(buttons);

    section.appendChild(main);
    section.appendChild(footer);

    shadow.appendChild(section);
  }

  styles() {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = `   
      .vengresso-linkedin-section {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .vengresso-linkedin-section main {
        display: flex;
        flex-direction: column;
        border-radius: 0.8rem;
        box-shadow: 0px 0px 0px 1px rgb(140 140 200);
      }

      .vengresso-linkedin-input {
        margin: 10px;
        padding: 10px;
        border-radius: 1.5rem;
        border: 1px solid rgb(140 140 140 / 0.2);
      }

      .vengresso-linkedin-buttons {
        display: flex;
        justify-content: space-around;
        margin: 10px;
      }

      .vengresso-linkedin-buttons button {
        background: transparent;
        border: 1px solid rgb(140 140 200);
        border-radius: 14px;
        height: 28px;
        padding: 5px 25px;
        cursor: pointer;

        transition: all 200ms ease;
      }

      .vengresso-linkedin-buttons button:hover:enabled {
        background-color:  rgb(100 100 180);
        color: white;
      }
      .vengresso-linkedin-buttons button:disabled {
        cursor: not-allowed;
      }

      .vengresso-linkedin-section-foooter {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
      }

      .vengresso-linkedin-section-hr {
        border-top-width: 1px;
        border-top-color: rgb(140 140 140 / 0.2);
        border-top-style: solid;
        width: calc(100% - 11rem);
      }

      .vengresso-linkedin-section-foooter-powered-by {
        font-size: 1rem;
        color: rgb(140 140 140 / 0.6);
        transform: translateY(-50%);
      }
    `;

    return style;
  }

  sendTextToInput(element, text, buttonClassname) {
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

        this.clearInput();
        clearInterval(interval);
        return;
      }

      element.innerText = String(text).substring(0, count);
    }, 50);
  }

  wait(seconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }

  async createNewLinkedinPost(text) {
    document.querySelector(this.newPostSelector).click();

    await this.wait(5); // wait 5 seconds to fake user interaction

    let waitingTime = 10; // seconds - Waiting time for new post modal shows up
    const interval = setInterval(() => {
      if (waitingTime === 0) {
        clearInterval(interval);
        alert("Failed to create new post");
        return;
      }

      if (this.hasInputAvailable) {
        const inputNewPost = document.querySelector("." + this.editorClassName);
        this.sendTextToInput(inputNewPost, text, this.sendNewPostBtnSelector);
        clearInterval(interval);
      } else {
        waitingTime--;
      }
    }, 1000);
  }

  sendTextToLinkedinInput() {
    const text = this.inputEl.value;
    const inputComment = document.querySelector("." + this.editorClassName);
    this.hasInputAvailable = !!inputComment;
    if (this.hasInputAvailable) {
      this.sendTextToInput(inputComment, text, this.sendCommentaryBtnSelector);
    } else {
      this.createNewLinkedinPost(text);
    }
  }
}

(() => {
  chrome.runtime.onMessage.addListener((obj) => {
    const { type } = obj;

    if (type === "INIT") {
      init();
    }
  });

  let linkedinMainContainerSelector,
    linkedinEditorClassName,
    linkedinNewPostSelector,
    linkedinSendNewPostButtonSelector,
    linkedinSendCommentaryButtonSelector;

  function fetchDataFromServer(callback) {
    setTimeout(() => {
      mockServerDataReturn();
      callback();
    }, 3000); // Here I can open a web socket connection with server or a request to get configuration data

    function mockServerDataReturn() {
      linkedinMainContainerSelector = "main.scaffold-layout__main";
      linkedinEditorClassName = "ql-editor";
      linkedinNewPostSelector = ".share-box-feed-entry__trigger";
      linkedinSendNewPostButtonSelector = ".share-actions__primary-action";
      linkedinSendCommentaryButtonSelector =
        ".comments-comment-box__submit-button";
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

  function injectHtmlSessionIntoHtmlDOM() {
    const mainEl = document.querySelector(linkedinMainContainerSelector);
    mainEl.prepend(createCustomElement());
  }

  function init() {
    defineCustomElements();

    // here used callback to simulate after opening the socket connection
    fetchDataFromServer(() => {
      injectHtmlSessionIntoHtmlDOM();
    });
  }

  function defineCustomElements() {
    customElements.define("extension-addon", ExtensionAddon);
  }

  init();
})();
