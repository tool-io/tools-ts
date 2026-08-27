import { describe, expect, it } from "vitest";
import {
  timeFactorConsolidationExample,
  runTimeFactorConsolidation,
} from "./tool.js";

describe("time-factor-consolidation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTimeFactorConsolidation(timeFactorConsolidationExample.input),
    ).toEqual({
      ok: true,
      output: timeFactorConsolidationExample.output,
    });
  });

  it("computes a representative two-way drained layer", () => {
    const result = runTimeFactorConsolidation({
      coefficientOfConsolidationM2PerYear: 2,
      elapsedTimeYears: 3,
      drainagePathM: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.timeFactor as number).toBe(1.5);
  });

  it("rejects a zero drainage path", () => {
    expect(
      runTimeFactorConsolidation({
        coefficientOfConsolidationM2PerYear: 1,
        elapsedTimeYears: 5,
        drainagePathM: 0,
      }).ok,
    ).toBe(false);
  });
});
