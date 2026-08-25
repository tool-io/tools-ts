import { describe, expect, it } from "vitest";
import {
  calculateRevenuePerTonMile,
  revenuePerTonMileExample,
  runRevenuePerTonMile,
} from "./tool.js";

describe("revenue-per-ton-mile", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRevenuePerTonMile(revenuePerTonMileExample.input)).toEqual({
      ok: true,
      output: revenuePerTonMileExample.output,
    });
  });

  it("handles fractional rates", () => {
    expect(
      runRevenuePerTonMile({
        milesHauled: 500,
        revenueUsd: 1234.5,
        tonsHauled: 15,
      }),
    ).toEqual({
      ok: true,
      output: { revenuePerTonMileUsd: 0.1646, tonMiles: 7500 },
    });
  });

  it("rejects zero tons", () => {
    expect(
      runRevenuePerTonMile({ milesHauled: 100, revenueUsd: 50, tonsHauled: 0 })
        .ok,
    ).toBe(false);
  });

  it("returns zero intensity for zero revenue", () => {
    expect(
      calculateRevenuePerTonMile({
        milesHauled: 100,
        revenueUsd: 0,
        tonsHauled: 2,
      }),
    ).toEqual({ revenuePerTonMileUsd: 0, tonMiles: 200 });
  });

  it("rejects non-finite inputs and unrepresentable outputs", () => {
    expect(() =>
      calculateRevenuePerTonMile({
        milesHauled: Number.POSITIVE_INFINITY,
        revenueUsd: 500,
        tonsHauled: 10,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateRevenuePerTonMile({
        milesHauled: Number.MAX_VALUE,
        revenueUsd: 500,
        tonsHauled: Number.MAX_VALUE,
      }),
    ).toThrow("workload is outside");
    expect(() =>
      calculateRevenuePerTonMile({
        milesHauled: 1,
        revenueUsd: Number.MIN_VALUE,
        tonsHauled: Number.MAX_VALUE,
      }),
    ).toThrow("Revenue per ton-mile is outside");
  });
});
