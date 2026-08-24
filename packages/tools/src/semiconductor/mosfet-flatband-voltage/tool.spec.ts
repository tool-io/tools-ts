import { describe, expect, it } from "vitest";
import {
  calculateMosfetFlatbandVoltage,
  mosfetFlatbandVoltageExample,
  runMosfetFlatbandVoltage,
} from "./tool.js";

describe("MOSFET Flatband Voltage Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMosfetFlatbandVoltage(mosfetFlatbandVoltageExample.input),
    ).toEqual({
      ok: true,
      output: mosfetFlatbandVoltageExample.output,
    });
  });

  it("equals the work-function difference without oxide charge", () => {
    expect(
      calculateMosfetFlatbandVoltage({
        coxFfPerUm2: 10,
        gateWorkFunctionEv: 4.6,
        oxideChargePerCm2: 0,
        semiconductorWorkFunctionEv: 4.1,
      }),
    ).toEqual({ flatbandVoltageV: 0.5 });
  });

  it("uses 1 square micrometre equals 1e-8 square centimetres", () => {
    const result = calculateMosfetFlatbandVoltage({
      coxFfPerUm2: 1,
      gateWorkFunctionEv: 4.5,
      oxideChargePerCm2: 1e10,
      semiconductorWorkFunctionEv: 4.5,
    });
    expect(result.flatbandVoltageV).toBeCloseTo(-0.01602176634, 14);
  });

  it("rejects non-positive oxide capacitance", () => {
    expect(
      runMosfetFlatbandVoltage({
        coxFfPerUm2: 0,
        gateWorkFunctionEv: 4.5,
        oxideChargePerCm2: 0,
        semiconductorWorkFunctionEv: 4.5,
      }).ok,
    ).toBe(false);
  });
});
