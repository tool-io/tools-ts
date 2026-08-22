import { describe, expect, it } from "vitest";
import {
  headwindTakeoffFactorExample,
  runHeadwindTakeoffFactor,
} from "./tool.js";

describe("headwind takeoff factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHeadwindTakeoffFactor(headwindTakeoffFactorExample.input),
    ).toEqual({
      ok: true,
      output: headwindTakeoffFactorExample.output,
    });
  });

  it("is neutral in still air", () => {
    expect(runHeadwindTakeoffFactor({ headwindKt: 0 })).toEqual({
      ok: true,
      output: { factor: 1 },
    });
  });

  it("floors the factor at fifty percent", () => {
    const result = runHeadwindTakeoffFactor({ headwindKt: 500 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.factor).toBe(0.5);
  });
});
