import { describe, expect, it } from "vitest";
import {
  runStipeAttachmentClassifier,
  stipeAttachmentClassifierExample,
  stipeAttachmentClassifierTool,
} from "./tool.js";

describe("stipeAttachmentClassifierTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStipeAttachmentClassifier(stipeAttachmentClassifierExample.input),
    ).toEqual({
      ok: true,
      output: stipeAttachmentClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(stipeAttachmentClassifierExample)),
    ).toEqual(stipeAttachmentClassifierExample);
    expect(stipeAttachmentClassifierTool.contractVersion).toBe(1);
    expect(stipeAttachmentClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("passes through the central attachment", () => {
    const r = runStipeAttachmentClassifier({ attachment: "central" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.stipeAttachmentClass).toBe("central");
  });

  it("passes through the eccentric and lateral attachments", () => {
    const eccentric = runStipeAttachmentClassifier({
      attachment: "eccentric",
    });
    const lateral = runStipeAttachmentClassifier({ attachment: "lateral" });
    if (!eccentric.ok || !lateral.ok) throw new Error("expected success");
    expect(eccentric.output.stipeAttachmentClass).toBe("eccentric");
    expect(lateral.output.stipeAttachmentClass).toBe("lateral");
  });

  it("passes through the absent attachment", () => {
    const r = runStipeAttachmentClassifier({ attachment: "absent" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.stipeAttachmentClass).toBe("absent");
  });

  it("rejects unknown attachments", () => {
    expect(runStipeAttachmentClassifier({ attachment: "off-center" }).ok).toBe(
      false,
    );
    expect(runStipeAttachmentClassifier({ attachment: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runStipeAttachmentClassifier(null).ok).toBe(false);
    expect(runStipeAttachmentClassifier({ attachment: undefined }).ok).toBe(
      false,
    );
    expect(
      runStipeAttachmentClassifier({
        ...stipeAttachmentClassifierExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
