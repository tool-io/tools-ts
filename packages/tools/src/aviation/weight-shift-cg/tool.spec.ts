import { describe, expect, it } from "vitest";
import {
  calculateWeightShiftCg,
  runWeightShiftCg,
  weightShiftCgExample,
} from "./tool.js";

describe("weight shift cg calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWeightShiftCg(weightShiftCgExample.input)).toEqual({
      ok: true,
      output: weightShiftCgExample.output,
    });
  });

  it("reports negative shift when moving forward", () => {
    const result = runWeightShiftCg({
      shiftDistanceIn: -20,
      shiftedWeightLb: 100,
      totalWeightLb: 2000,
    });
    if (!result.ok) throw new Error("expected success");
    expect((result.output as { cgShiftIn: number }).cgShiftIn).toBe(-1);
  });

  it("rejects zero total weight through execution", () => {
    expect(
      runWeightShiftCg({
        shiftDistanceIn: 20,
        shiftedWeightLb: 100,
        totalWeightLb: 0,
      }).ok,
    ).toBe(false);
  });
});
