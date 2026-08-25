import { describe, expect, it } from "vitest";
import {
  calculateContinuousCustomsBondMinimumLookup,
  continuousCustomsBondMinimumLookupExample,
  runContinuousCustomsBondMinimumLookup,
} from "./tool.js";

describe("logistics/continuous-customs-bond-minimum-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runContinuousCustomsBondMinimumLookup(
        continuousCustomsBondMinimumLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: continuousCustomsBondMinimumLookupExample.output,
    });
  });

  it("scales above the minimum for high-volume importers", () => {
    const result = runContinuousCustomsBondMinimumLookup({
      priorTwelveMonthChargesUsd: 800000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.computedBondAmount as number).toBe(80000);
    expect(result.output.minimumApplies).toBe(false);
    expect(result.output.requiredBondAmount as number).toBe(80000);
  });

  it("applies the published bond rounding increment", () => {
    expect(
      calculateContinuousCustomsBondMinimumLookup({
        priorTwelveMonthChargesUsd: 760000,
      }),
    ).toEqual({
      computedBondAmount: 76000,
      minimumApplies: false,
      requiredBondAmount: 80000,
    });
  });

  it("rejects negative charges via schema validation", () => {
    expect(
      runContinuousCustomsBondMinimumLookup({
        priorTwelveMonthChargesUsd: -1,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite direct inputs", () => {
    expect(() =>
      calculateContinuousCustomsBondMinimumLookup({
        priorTwelveMonthChargesUsd: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
  });
});
