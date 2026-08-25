import { describe, expect, it } from "vitest";
import {
  uvLogReductionCalculatorExample,
  uvLogReductionCalculatorTool,
  runUvLogReductionCalculator,
} from "./tool.js";

describe("UV Log Reduction", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runUvLogReductionCalculator(uvLogReductionCalculatorExample.input),
    ).toEqual({
      ok: true,
      output: uvLogReductionCalculatorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(uvLogReductionCalculatorExample))).toEqual(
      uvLogReductionCalculatorExample,
    );
    expect(uvLogReductionCalculatorTool.contractVersion).toBe(1);
    expect(uvLogReductionCalculatorTool.execution).toEqual({ kind: "pure" });
  });

  it("yields zero reduction when no survivors are lost", () => {
    const result = runUvLogReductionCalculator({
      initialCfuPerMl: 1000,
      survivingCfuPerMl: 1000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.uvLogReduction).toBe(0);
  });

  it("computes fractional reductions for partial kills", () => {
    const result = runUvLogReductionCalculator({
      initialCfuPerMl: 100000,
      survivingCfuPerMl: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.uvLogReduction).toBeCloseTo(3, 12);
  });

  it("guards total sterilization with zero survivors", () => {
    const result = runUvLogReductionCalculator({
      initialCfuPerMl: 1000,
      survivingCfuPerMl: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("zero_survivors");
  });

  it("requires positive initial counts", () => {
    expect(
      runUvLogReductionCalculator({ initialCfuPerMl: 0, survivingCfuPerMl: 10 })
        .ok,
    ).toBe(false);
    expect(
      runUvLogReductionCalculator({
        initialCfuPerMl: -5,
        survivingCfuPerMl: 10,
      }).ok,
    ).toBe(false);
  });
  it("rejects survivor counts above the initial count", () => {
    const result = runUvLogReductionCalculator({
      initialCfuPerMl: 100,
      survivingCfuPerMl: 101,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("survivors_exceed_initial");
  });

  it("returns structured errors for malformed input", () => {
    expect(runUvLogReductionCalculator(null).ok).toBe(false);
    expect(
      runUvLogReductionCalculator({
        ...uvLogReductionCalculatorExample.input,
        dose: 1,
      }).ok,
    ).toBe(false);
  });
});
