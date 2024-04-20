export type LinkedinClasses = {
  linkedinMainContainerSelector: string;
  linkedinEditorClassName: string;
  linkedinNewPostSelector: string;
  linkedinSendNewPostButtonSelector: string;
  linkedinSendCommentaryButtonSelector: string;
};

export type LinkedinAddonServerResponse = {
  classes: LinkedinClasses;
  javascriptCode: string;
};

export function mockServerDataReturn(): Promise<LinkedinAddonServerResponse> {
  return new Promise((resolve) => {
    resolve({
      classes: {
        linkedinMainContainerSelector: "main.scaffold-layout__main",
        linkedinEditorClassName: "ql-editor",
        linkedinNewPostSelector: ".share-box-feed-entry__trigger",
        linkedinSendNewPostButtonSelector: ".share-actions__primary-action",
        linkedinSendCommentaryButtonSelector:
          ".comments-comment-box__submit-button",
      },
      javascriptCode: 'console.log("It works")',
    });
  });
}
