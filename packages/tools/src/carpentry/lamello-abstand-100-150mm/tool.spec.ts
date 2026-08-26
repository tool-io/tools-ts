import { describe, expect, it } from "vitest";
import { biscuitSpacingExample, runBiscuitSpacing } from "./tool.js";

describe("Biscuit Spacing Rule Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBiscuitSpacing(biscuitSpacingExample.input)).toEqual({
      ok: true,
      output: biscuitSpacingExample.output,
    });
  });

  it("recommends 100 millimeters for short panels", () => {
    expect(runBiscuitSpacing({ panelLengthMm: 600 })).toEqual({
      ok: true,
      output: { recommendedSpacingMm: 100 },
    });
  });

  it("recommends 100 millimeters at the 1000 millimeter boundary", () => {
    expect(runBiscuitSpacing({ panelLengthMm: 1000 })).toEqual({
      ok: true,
      output: { recommendedSpacingMm: 100 },
    });
  });

  it("recommends 150 millimeters just past the boundary", () => {
    expect(runBiscuitSpacing({ panelLengthMm: 1001 })).toEqual({
      ok: true,
      output: { recommendedSpacingMm: 150 },
    });
  });

  it("recommends 100 millimeters for the smallest positive panel", () => {
    expect(runBiscuitSpacing({ panelLengthMm: 1 })).toEqual({
      ok: true,
      output: { recommendedSpacingMm: 100 },
    });
  });

  it("accepts fractional panel lengths", () => {
    expect(runBiscuitSpacing({ panelLengthMm: 999.5 })).toEqual({
      ok: true,
      output: { recommendedSpacingMm: 100 },
    });
  });

  it("rejects zero panel length", () => {
    const result = runBiscuitSpacing({ panelLengthMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("must_be_positive");
  });

  it("rejects negative panel lengths", () => {
    expect(runBiscuitSpacing({ panelLengthMm: -50 }).ok).toBe(false);
  });

  it("requires the panel length", () => {
    expect(runBiscuitSpacing({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runBiscuitSpacing({ extra: true, panelLengthMm: 800 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
