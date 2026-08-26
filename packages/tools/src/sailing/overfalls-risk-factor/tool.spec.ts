import { describe, expect, it } from "vitest";
import {
  calculateOverfallsRiskFactor,
  overfallsRiskFactorExample,
  runOverfallsRiskFactor,
} from "./tool.js";

describe("Overfalls Risk Factor", () => {
  it("publishes an executable example", () =>
    expect(runOverfallsRiskFactor(overfallsRiskFactorExample.input)).toEqual({
      ok: true,
      output: overfallsRiskFactorExample.output,
    }));

  it.each([
    [5, 4, 20, 1],
    [3.2, 8, 2.5, 10.24],
    [7, 2, 3.5, 4],
    [4.5, 6, 9, 3],
  ])(
    "multiplies range by rate and divides by depth",
    (springRangeMeters, maximumRateKt, depthMeters, expected) => {
      expect(
        calculateOverfallsRiskFactor({
          depthMeters,
          maximumRateKt,
          springRangeMeters,
        }),
      ).toEqual({
        overfallsRiskFactor: expected,
      });
    },
  );

  it("grows with the spring range for fixed depth", () => {
    const small = calculateOverfallsRiskFactor({
      depthMeters: 10,
      maximumRateKt: 3,
      springRangeMeters: 2,
    });
    const large = calculateOverfallsRiskFactor({
      depthMeters: 10,
      maximumRateKt: 3,
      springRangeMeters: 4,
    });
    expect(large.overfallsRiskFactor).toBe(small.overfallsRiskFactor * 2);
  });

  it("shrinks as the water deepens", () => {
    const shallow = calculateOverfallsRiskFactor({
      depthMeters: 5,
      maximumRateKt: 4,
      springRangeMeters: 5,
    });
    const deep = calculateOverfallsRiskFactor({
      depthMeters: 20,
      maximumRateKt: 4,
      springRangeMeters: 5,
    });
    expect(deep.overfallsRiskFactor).toBe(shallow.overfallsRiskFactor / 4);
  });

  it("rejects non-positive spring ranges", () => {
    const result = runOverfallsRiskFactor({
      depthMeters: 20,
      maximumRateKt: 4,
      springRangeMeters: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_range");
  });

  it("rejects non-positive stream rates", () => {
    const result = runOverfallsRiskFactor({
      depthMeters: 20,
      maximumRateKt: -1,
      springRangeMeters: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_rate");
  });

  it("rejects non-positive depths", () => {
    const result = runOverfallsRiskFactor({
      depthMeters: 0,
      maximumRateKt: 4,
      springRangeMeters: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_depth");
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runOverfallsRiskFactor({
        depthMeters: Number.NaN,
        maximumRateKt: 4,
        springRangeMeters: 5,
      }).ok,
    ).toBe(false);
    expect(
      runOverfallsRiskFactor({ depthMeters: 20, maximumRateKt: 4 }).ok,
    ).toBe(false);
    expect(
      runOverfallsRiskFactor({
        depthMeters: 20,
        extra: 1,
        maximumRateKt: 4,
        springRangeMeters: 5,
      }).ok,
    ).toBe(false);
  });
});
