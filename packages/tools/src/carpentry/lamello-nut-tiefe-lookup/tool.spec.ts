import { describe, expect, it } from "vitest";
import { biscuitSlotDepthExample, runBiscuitSlotDepth } from "./tool.js";

describe("Biscuit Slot Depth Lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBiscuitSlotDepth(biscuitSlotDepthExample.input)).toEqual({
      ok: true,
      output: biscuitSlotDepthExample.output,
    });
  });

  it("uses the size 0 plunge depth", () => {
    expect(runBiscuitSlotDepth({ size: "0" })).toEqual({
      ok: true,
      output: { slotDepthMm: 8 },
    });
  });

  it("uses the size 20 plunge depth", () => {
    expect(runBiscuitSlotDepth({ size: "20" })).toEqual({
      ok: true,
      output: { slotDepthMm: 12 },
    });
  });

  it("covers every documented size", () => {
    for (const size of ["0", "10", "20"] as const) {
      const result = runBiscuitSlotDepth({ size });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects unknown sizes", () => {
    const result = runBiscuitSlotDepth({ size: "15" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("size");
  });

  it("rejects differently cased sizes", () => {
    expect(runBiscuitSlotDepth({ size: "Ten" }).ok).toBe(false);
  });

  it("requires the size", () => {
    expect(runBiscuitSlotDepth({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runBiscuitSlotDepth({ extra: true, size: "20" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runBiscuitSlotDepth(null).ok).toBe(false);
  });
});
