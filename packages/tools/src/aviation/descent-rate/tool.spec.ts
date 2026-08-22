import { describe, expect, it } from "vitest";
import { descentRateExample, runDescentRate } from "./tool.js";

describe("descent rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDescentRate(descentRateExample.input)).toEqual({
      ok: true,
      output: descentRateExample.output,
    });
  });

  it("doubles the rate when ground speed doubles", () => {
    const baseResult = runDescentRate({
      descentAngleDeg: 3,
      groundSpeedKt: 60,
    });
    const doubledResult = runDescentRate({
      descentAngleDeg: 3,
      groundSpeedKt: 120,
    });
    if (!baseResult.ok || !doubledResult.ok)
      throw new Error("expected success");
    const base = baseResult.output.rateFpm as number;
    const doubled = doubledResult.output.rateFpm as number;
    expect(doubled).toBeCloseTo(base * 2, 6);
  });

  it("rejects out-of-range angles through execution", () => {
    for (const angle of [0, 90, -3])
      expect(
        runDescentRate({ descentAngleDeg: angle, groundSpeedKt: 120 }).ok,
      ).toBe(false);
  });
});
