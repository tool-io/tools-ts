import { describe, expect, it } from "vitest";
import { keelAspectRatioExample, runKeelAspectRatio } from "./tool.js";

describe("Keel Aspect Ratio", () => {
  it("calculates the canonical example", () =>
    expect(runKeelAspectRatio(keelAspectRatioExample.input)).toEqual({
      ok: true,
      output: keelAspectRatioExample.output,
    }));
  it("rewards deep narrow keels with high ratios", () =>
    expect(runKeelAspectRatio({ draftMeters: 3, keelAreaM2: 1.5 })).toEqual({
      ok: true,
      output: { keelAspectRatio: 6 },
    }));
  it("gives low ratios for shallow wide keels", () =>
    expect(runKeelAspectRatio({ draftMeters: 1, keelAreaM2: 2 })).toEqual({
      ok: true,
      output: { keelAspectRatio: 0.5 },
    }));
  it("squares the draft in the numerator", () => {
    const single = runKeelAspectRatio({ draftMeters: 1, keelAreaM2: 1 });
    const doubled = runKeelAspectRatio({ draftMeters: 2, keelAreaM2: 1 });
    if (!single.ok || !doubled.ok) throw new Error("Expected success.");
    expect(single.output.keelAspectRatio).toBe(1);
    expect(doubled.output.keelAspectRatio).toBe(4);
  });
  it("rejects non-positive draft", () => {
    const result = runKeelAspectRatio({ draftMeters: 0, keelAreaM2: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_draft");
  });
  it("rejects non-positive keel area", () => {
    const result = runKeelAspectRatio({ draftMeters: 2, keelAreaM2: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_area");
  });
  it("rejects negative inputs", () =>
    expect(runKeelAspectRatio({ draftMeters: -2, keelAreaM2: 2 }).ok).toBe(
      false,
    ));
  it("rejects missing and malformed input", () => {
    expect(runKeelAspectRatio({}).ok).toBe(false);
    expect(runKeelAspectRatio({ draftMeters: "2", keelAreaM2: 2 }).ok).toBe(
      false,
    );
    expect(runKeelAspectRatio(null).ok).toBe(false);
  });
});
