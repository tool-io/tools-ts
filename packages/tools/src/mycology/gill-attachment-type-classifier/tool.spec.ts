import { describe, expect, it } from "vitest";
import {
  gillAttachmentTypeClassifierExample,
  gillAttachmentTypeClassifierTool,
  runGillAttachmentTypeClassifier,
} from "./tool.js";

describe("gillAttachmentTypeClassifierTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGillAttachmentTypeClassifier(
        gillAttachmentTypeClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: gillAttachmentTypeClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(gillAttachmentTypeClassifierExample)),
    ).toEqual(gillAttachmentTypeClassifierExample);
    expect(gillAttachmentTypeClassifierTool.contractVersion).toBe(1);
    expect(gillAttachmentTypeClassifierTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("passes through the free and adnate attachments", () => {
    const free = runGillAttachmentTypeClassifier({ attachment: "free" });
    const adnate = runGillAttachmentTypeClassifier({ attachment: "adnate" });
    if (!free.ok || !adnate.ok) throw new Error("expected success");
    expect(free.output.attachmentClass).toBe("free");
    expect(adnate.output.attachmentClass).toBe("adnate");
  });

  it("passes through the adnexed and sinuate attachments", () => {
    const adnexed = runGillAttachmentTypeClassifier({ attachment: "adnexed" });
    const sinuate = runGillAttachmentTypeClassifier({ attachment: "sinuate" });
    if (!adnexed.ok || !sinuate.ok) throw new Error("expected success");
    expect(adnexed.output.attachmentClass).toBe("adnexed");
    expect(sinuate.output.attachmentClass).toBe("sinuate");
  });

  it("passes through the decurrent and emarginate attachments", () => {
    const decurrent = runGillAttachmentTypeClassifier({
      attachment: "decurrent",
    });
    const emarginate = runGillAttachmentTypeClassifier({
      attachment: "emarginate",
    });
    if (!decurrent.ok || !emarginate.ok) throw new Error("expected success");
    expect(decurrent.output.attachmentClass).toBe("decurrent");
    expect(emarginate.output.attachmentClass).toBe("emarginate");
  });

  it("rejects unknown attachments", () => {
    expect(
      runGillAttachmentTypeClassifier({ attachment: "collariate" }).ok,
    ).toBe(false);
    expect(runGillAttachmentTypeClassifier({ attachment: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runGillAttachmentTypeClassifier(null).ok).toBe(false);
    expect(runGillAttachmentTypeClassifier({ attachment: [] }).ok).toBe(false);
    expect(
      runGillAttachmentTypeClassifier({
        ...gillAttachmentTypeClassifierExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
