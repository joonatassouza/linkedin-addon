import jsdom from "jsdom";

const { JSDOM } = jsdom;

const { window } = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>
`);

const { document } = window;

export default class TestBed {
  static async MockComponent(options: {
    selector: string;
    target: CustomElementConstructor;
  }) {
    window.customElements.define(options.selector, options.target);

    return await _waitForComponentToRender(options.selector);
  }

  static RemoveComponent(node: Element | null) {
    if (node) {
      document.removeChild(node);
    }
  }
}

async function _waitForComponentToRender(tag: string): Promise<Element> {
  let ele = document.createElement(tag);
  ele.setAttribute("editor-class-name", "linkedinEditorClassName");
  ele.setAttribute("new-post-selector", "linkedinNewPostSelector");
  ele.setAttribute(
    "send-new-post-btn-selector",
    "linkedinSendNewPostButtonSelector"
  );
  ele.setAttribute(
    "send-commentary-btn-selector",
    "linkedinSendCommentaryButtonSelector"
  );

  document.body.appendChild(ele);

  return new Promise((resolve) => {
    function requestComponent() {
      const element = document.querySelector(tag);
      if (element) {
        resolve(element);
      } else {
        window.requestAnimationFrame(requestComponent);
      }
    }
    requestComponent();
  });
}
