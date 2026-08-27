import { describe, expect, it } from "vitest";
import {
  coefficientOfConsolidationExample,
  runCoefficientOfConsolidation,
} from "./tool.js";

describe("coefficient-of-consolidation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCoefficientOfConsolidation(coefficientOfConsolidationExample.input),
    ).toEqual({
      ok: true,
      output: coefficientOfConsolidationExample.output,
    });
  });

  it("computes a representative curve-fitted cv", () => {
    const result = runCoefficientOfConsolidation({
      timeFactor: 0.2,
      drainagePathM: 4,
      elapsedTimeYears: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.coefficientOfConsolidationM2PerYear as number).toBe(
      3.2,
    );
  });

  it("rejects a non-positive elapsed time", () => {
    expect(
      runCoefficientOfConsolidation({
        timeFactor: 0.4,
        drainagePathM: 2,
        elapsedTimeYears: 0,
      }).ok,
    ).toBe(false);
  });
});
