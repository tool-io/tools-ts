import { describe, expect, it } from "vitest";
import { runComplexPowerMagnitude } from "./tool.js";
describe("Complex Power Magnitude", () => {
  it("calculates a valid result", () =>
    expect(runComplexPowerMagnitude({ realWatts: 3, reactiveVar: 4 })).toEqual({
      ok: true,
      output: { magnitudeVA: 5 },
    }));
  it("ignores the sign of reactive power", () =>
    expect(
      runComplexPowerMagnitude({ realWatts: 40, reactiveVar: -30 }),
    ).toEqual({
      ok: true,
      output: { magnitudeVA: 50 },
    }));
  it("allows zero inputs", () =>
    expect(runComplexPowerMagnitude({ realWatts: 0, reactiveVar: 0 })).toEqual({
      ok: true,
      output: { magnitudeVA: 0 },
    }));
  it("rejects non-finite input", () =>
    expect(
      runComplexPowerMagnitude({
        realWatts: Number.POSITIVE_INFINITY,
        reactiveVar: 1,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runComplexPowerMagnitude({
      extra: 3,
      realWatts: 1,
      reactiveVar: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runComplexPowerMagnitude({ realWatts: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(
      runComplexPowerMagnitude({ realWatts: "3", reactiveVar: 4 }).ok,
    ).toBe(false));
});
