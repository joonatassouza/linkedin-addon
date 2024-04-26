import { mockServerDataReturn } from "../../../src/service/api";

describe("Services", () => {
  it("should return configuration data", async () => {
    const data = await mockServerDataReturn();

    expect(data).toHaveProperty("classes");
    expect(data.classes).toHaveProperty("linkedinMainContainerSelector");
    expect(data.classes).toHaveProperty("linkedinEditorClassName");
    expect(data.classes).toHaveProperty("linkedinNewPostSelector");
    expect(data.classes).toHaveProperty("linkedinSendNewPostButtonSelector");
    expect(data.classes).toHaveProperty("linkedinSendCommentaryButtonSelector");
    expect(data).toHaveProperty("javascriptFile");
  });
});
