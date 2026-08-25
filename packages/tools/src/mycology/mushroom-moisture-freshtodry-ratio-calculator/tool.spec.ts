import { describe, expect, it } from "vitest";
import {
  freshToDryRatioCalculatorExample,
  freshToDryRatioCalculatorTool,
  runFreshToDryRatioCalculator,
} from "./tool.js";

describe("Fresh:Dry Ratio", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runFreshToDryRatioCalculator(freshToDryRatioCalculatorExample.input),
    ).toEqual({
      ok: true,
      output: freshToDryRatioCalculatorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(freshToDryRatioCalculatorExample)),
    ).toEqual(freshToDryRatioCalculatorExample);
    expect(freshToDryRatioCalculatorTool.contractVersion).toBe(1);
    expect(freshToDryRatioCalculatorTool.execution).toEqual({ kind: "pure" });
  });

  it("reports a unit ratio for fully dehydrated tissue", () => {
    const result = runFreshToDryRatioCalculator({ freshMassG: 8, dryMassG: 8 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.freshToDryRatio).toBe(1);
  });

  it("computes fractional moisture ratios", () => {
    const result = runFreshToDryRatioCalculator({
      freshMassG: 55,
      dryMassG: 8,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.freshToDryRatio).toBeCloseTo(6.875, 12);
  });

  it("guards a fresh mass lighter than the dry mass", () => {
    const result = runFreshToDryRatioCalculator({
      freshMassG: 5,
      dryMassG: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_masses");
  });

  it("rejects non-positive dry masses", () => {
    expect(
      runFreshToDryRatioCalculator({ freshMassG: 10, dryMassG: 0 }).ok,
    ).toBe(false);
    expect(
      runFreshToDryRatioCalculator({ freshMassG: 10, dryMassG: -2 }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runFreshToDryRatioCalculator(null).ok).toBe(false);
    expect(runFreshToDryRatioCalculator({ freshMassG: 100 }).ok).toBe(false);
    expect(
      runFreshToDryRatioCalculator({
        ...freshToDryRatioCalculatorExample.input,
        ratio: 10,
      }).ok,
    ).toBe(false);
  });
});
