import { describe, expect, it } from "vitest";
import { calculateMachNumber, machNumberExample, runMachNumber } from "./tool.js";

describe("mach number calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMachNumber(machNumberExample.input)).toEqual({
      ok: true,
      output: machNumberExample.output,
    });
  });

  it("rises as temperature falls at a fixed TAS", () => {
    const warm = calculateMachNumber({
      oatC: 15,
      trueAirspeedKt: 400,
    });
    const cold = calculateMachNumber({
      oatC: -55,
      trueAirspeedKt: 400,
    });
    expect(cold.mach).toBeGreaterThan(warm.mach);
  });

  it("rejects temperatures below absolute zero through execution", () => {
    expect(
      runMachNumber({ oatC: -300, trueAirspeedKt: 400 }).ok,
    ).toBe(false);
  });
});
