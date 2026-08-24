import { describe, expect, it } from "vitest";
import {
  calculateCostPerTonMileComputed,
  costPerTonMileComputedExample,
  runCostPerTonMileComputed,
} from "./tool.js";

describe("cost-per-ton-mile-computed", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCostPerTonMileComputed(costPerTonMileComputedExample.input),
    ).toEqual({
      ok: true,
      output: costPerTonMileComputedExample.output,
    });
  });

  it("handles whole-cent results", () => {
    expect(
      runCostPerTonMileComputed({
        milesHauled: 1000,
        operatingCostUsd: 2500,
        tonsHauled: 10,
      }),
    ).toEqual({
      ok: true,
      output: { costPerTonMileUsd: 0.25, tonMiles: 10000 },
    });
  });

  it("returns zero intensity for zero operating cost", () => {
    expect(
      calculateCostPerTonMileComputed({
        milesHauled: 100,
        operatingCostUsd: 0,
        tonsHauled: 2,
      }),
    ).toEqual({ costPerTonMileUsd: 0, tonMiles: 200 });
  });

  it("reports zero public miles on the denominator field", () => {
    const result = runCostPerTonMileComputed({
      milesHauled: 0,
      operatingCostUsd: 500,
      tonsHauled: 10,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "milesHauled",
    });
  });

  it("rejects non-finite inputs and unrepresentable outputs", () => {
    expect(() =>
      calculateCostPerTonMileComputed({
        milesHauled: Number.POSITIVE_INFINITY,
        operatingCostUsd: 500,
        tonsHauled: 10,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateCostPerTonMileComputed({
        milesHauled: Number.MAX_VALUE,
        operatingCostUsd: 500,
        tonsHauled: Number.MAX_VALUE,
      }),
    ).toThrow("workload is outside");
    expect(() =>
      calculateCostPerTonMileComputed({
        milesHauled: 1,
        operatingCostUsd: Number.MIN_VALUE,
        tonsHauled: Number.MAX_VALUE,
      }),
    ).toThrow("Cost per ton-mile is outside");
  });
});
