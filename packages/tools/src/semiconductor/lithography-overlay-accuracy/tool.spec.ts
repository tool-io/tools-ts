import { describe, expect, it } from "vitest";
import { overlayBudgetExample, runOverlayBudget } from "./tool.js";

describe("Overlay Budget Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOverlayBudget(overlayBudgetExample.input)).toEqual({
      ok: true,
      output: overlayBudgetExample.output,
    });
  });

  it("scales pitch by the supplied overlay fraction", () => {
    expect(
      runOverlayBudget({ overlayFractionOfPitch: 0.05, pitchNm: 120 }),
    ).toEqual({ ok: true, output: { overlayBudgetNm: 6 } });
  });

  it("allows fractions from zero through one", () => {
    expect(
      runOverlayBudget({ overlayFractionOfPitch: 0, pitchNm: 48 }),
    ).toEqual({
      ok: true,
      output: { overlayBudgetNm: 0 },
    });
    expect(
      runOverlayBudget({ overlayFractionOfPitch: 1, pitchNm: 48 }).ok,
    ).toBe(true);
  });

  it("requires positive pitch and an explicit bounded fraction", () => {
    for (const input of [
      { pitchNm: 48 },
      { overlayFractionOfPitch: 0.03, pitchNm: 0 },
      { overlayFractionOfPitch: 1.1, pitchNm: 48 },
    ])
      expect(runOverlayBudget(input).ok).toBe(false);
  });
});
