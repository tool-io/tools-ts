import { describe, expect, it } from "vitest";
import { runEc50Hill } from "./tool.js";

describe("Hill EC50 Fit Check", () => {
  it("calculates a valid result", () =>
    expect(runEc50Hill({ conc: 30, ec50: 10, hillSlope: 2 })).toEqual({
      ok: true,
      output: { predictedEffectFraction: 0.9 },
    }));
  it("predicts one half exactly at the EC50", () =>
    expect(runEc50Hill({ conc: 10, ec50: 10, hillSlope: 1.7 })).toEqual({
      ok: true,
      output: { predictedEffectFraction: 0.5 },
    }));
  it("matches the unit-slope hyperbola", () => {
    const result = runEc50Hill({ conc: 30, ec50: 10, hillSlope: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.predictedEffectFraction).toBe(0.75);
  });
  it("approaches saturation far above the EC50", () => {
    const result = runEc50Hill({ conc: 100000, ec50: 1, hillSlope: 2 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.predictedEffectFraction).toBeCloseTo(1, 9);
  });
  it("stays small far below the EC50", () => {
    const result = runEc50Hill({ conc: 0.001, ec50: 1000, hillSlope: 1 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.predictedEffectFraction).toBeCloseTo(0.000001, 9);
  });
  it("returns zero effect at zero concentration", () =>
    expect(runEc50Hill({ conc: 0, ec50: 10, hillSlope: 1 })).toEqual({
      ok: true,
      output: { predictedEffectFraction: 0 },
    }));
  it("rejects a negative concentration", () =>
    expect(runEc50Hill({ conc: -1, ec50: 10, hillSlope: 1 }).ok).toBe(false));
  it("rejects a non-positive EC50", () => {
    const result = runEc50Hill({ conc: 5, ec50: -1, hillSlope: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_ec50");
  });
  it("rejects a non-positive hill slope", () => {
    const result = runEc50Hill({ conc: 5, ec50: 10, hillSlope: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_slope");
  });
});
