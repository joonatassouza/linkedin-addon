import { ExtensionAddon } from "../../../src/components/ExtensionAddon";

function prepareExtensionHtml() {
  const section = document.createElement("section");

  section.innerHTML = `
    <extension-addon
      id="extensionId"
      editor-class-name="ql-editor"
      new-post-selector=".share-box-feed-entry__trigger"
      send-new-post-btn-selector=".share-actions__primary-action"
      send-commentary-btn-selector=".comments-comment-box__submit-button"
    ></extension-addon>
  `;

  //   linkedinMainContainerSelector: "main.scaffold-layout__main",
  //   linkedinNewPostSelector: ".share-box-feed-entry__trigger",

  //   linkedinEditorClassName: "ql-editor",
  //   linkedinSendNewPostButtonSelector: ".share-actions__primary-action",
  //   linkedinSendCommentaryButtonSelector: ".comments-comment-box__submit-button",
  document.body.appendChild(section);

  const shaddowEl = document.querySelector("#extensionId");

  const sendButton = shaddowEl?.shadowRoot?.querySelector(
    ".vengresso-linkedin-send-button"
  ) as HTMLButtonElement;

  const clearButton = shaddowEl?.shadowRoot?.querySelector(
    ".vengresso-linkedin-clear-button"
  ) as HTMLButtonElement;

  const saveButton = shaddowEl?.shadowRoot?.querySelector(
    ".vengresso-linkedin-save-button"
  ) as HTMLButtonElement;

  const refreshButton = shaddowEl?.shadowRoot?.querySelector(
    ".vengresso-linkedin-refresh-button"
  ) as HTMLButtonElement;

  const input = shaddowEl?.shadowRoot?.querySelector(
    ".vengresso-linkedin-input"
  ) as HTMLInputElement;

  const element = document.querySelector("#extensionId") as ExtensionAddon;

  return {
    element,
    input,
    sendButton,
    clearButton,
    saveButton,
    refreshButton,
  };
}
//   linkedinMainContainerSelector: "main.scaffold-layout__main",
//   linkedinNewPostSelector: ".share-box-feed-entry__trigger",

//   linkedinEditorClassName: "ql-editor",
//   linkedinSendNewPostButtonSelector: ".share-actions__primary-action",
//   linkedinSendCommentaryButtonSelector: ".comments-comment-box__submit-button",
function prepareLinkedinCommentsOpenedMockHtml() {
  const div = document.createElement("div");

  div.innerHTML = `<main class="scaffold-layout__main">
      <div class="ql-editor" contenteditable="true" role="textbox" aria-multiline="true">
        <p><br></p>
      </div>
      <button class="comments-comment-box__submit-button"></button>
    </main>
  `;

  document.body.appendChild(div);

  const input = document.querySelector(".ql-editor") as HTMLInputElement;

  const sendButton = document.querySelector(
    ".comments-comment-box__submit-button"
  ) as HTMLButtonElement;

  return {
    input,
    sendButton,
  };
}

describe("Extension Custom Element", () => {
  beforeAll(() => {
    customElements.define("extension-addon", ExtensionAddon);
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should render custom element to HTML DOM", () => {
    const element = new ExtensionAddon();

    document.body.appendChild(element);

    expect(
      document.body.querySelector("extension-addon")?.shadowRoot?.innerHTML
    ).toContain("Powered by: Jonatas");
  });

  it("should set linkedin classes correctly", () => {
    const { element } = prepareExtensionHtml();

    expect(element.editorClassName).toBe("ql-editor");
    expect(element.newPostSelector).toBe(".share-box-feed-entry__trigger");
    expect(element.sendNewPostBtnSelector).toBe(
      ".share-actions__primary-action"
    );
    expect(element.sendCommentaryBtnSelector).toBe(
      ".comments-comment-box__submit-button"
    );
  });

  it("should disable action buttons when input is cleared", () => {
    const { sendButton, clearButton, saveButton } = prepareExtensionHtml();

    expect(sendButton.disabled).toBe(true);
    expect(clearButton.disabled).toBe(true);
    expect(saveButton.disabled).toBe(true);
  });

  it("should enable action buttons when input has text", () => {
    const { input, sendButton, clearButton, saveButton } =
      prepareExtensionHtml();

    input.value = "test";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect(sendButton.disabled).toBe(false);
    expect(clearButton.disabled).toBe(false);
    expect(saveButton.disabled).toBe(false);
  });

  it("should clear input on clear button click", () => {
    const { input, clearButton } = prepareExtensionHtml();

    input.value = "test";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    clearButton.click();

    expect(input.value).toBeFalsy();
  });

  it("should save text to local storage", () => {
    const textToSave = "text to save to local storage";

    jest.spyOn(chrome.storage.sync, "set").mockResolvedValue(true as never);
    jest.spyOn(chrome.storage.sync, "get").mockResolvedValue({
      ["@vengresso|savedText"]: textToSave,
    } as never);

    const { input, saveButton } = prepareExtensionHtml();

    input.value = textToSave;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    saveButton.click();

    expect(
      chrome.storage.sync.get("@vengresso|savedText")
    ).resolves.toMatchObject({
      ["@vengresso|savedText"]: textToSave,
    });
  });

  it("should send a message to a new post", async () => {
    const textToInput = "text to input";
    let textReceived = "";

    const { input, sendButton } = prepareExtensionHtml();
    const { input: linkedinInput, sendButton: linkedinSendButton } =
      prepareLinkedinCommentsOpenedMockHtml();

    linkedinSendButton.addEventListener("click", () => {
      textReceived = linkedinInput.innerText;
    });

    input.value = textToInput;
    input.dispatchEvent(new Event("input", { bubbles: true }));

    sendButton.click();

    await wait(3);

    expect(textReceived).toBe(textToInput);
  });
});

function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });
}
