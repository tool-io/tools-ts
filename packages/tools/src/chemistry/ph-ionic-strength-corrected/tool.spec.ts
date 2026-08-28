import { describe, expect, it } from "vitest";
import { runPhIonicStrengthCorrected } from "./tool.js";
describe("pH Ionic Strength Corrected Calculator", () => {
  it("adds correction to measured pH", () => {
    expect(
      runPhIonicStrengthCorrected({ correctionTerm: 0.05, measuredPh: 7.0 }),
    ).toEqual({ ok: true, output: { correctedPh: 7.05 } });
  });
  it("rejects invalid input", () =>
    expect(runPhIonicStrengthCorrected(null).ok).toBe(false));
});
