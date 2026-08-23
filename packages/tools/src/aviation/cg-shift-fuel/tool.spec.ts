import { describe, expect, it } from "vitest";
import { cgShiftFuelExample, runCgShiftFuel } from "./tool.js";

describe("fuel burn CG shift calculator", () => {
  it("reproduces its canonical example", () => {
    expect(runCgShiftFuel(cgShiftFuelExample.input)).toEqual({
      ok: true,
      output: cgShiftFuelExample.output,
    });
  });
  it("moves aft when fuel is ahead of the zero-fuel CG", () => {
    const result = runCgShiftFuel({
      fuelArmCm: 200,
      fuelWeightKg: 1000,
      zeroFuelCgArmCm: 250,
      zeroFuelWeightKg: 50000,
    });
    expect(result.ok && result.output.cgShiftCm).toBeGreaterThan(0);
  });
  it("moves forward when fuel is aft of the zero-fuel CG", () => {
    const result = runCgShiftFuel({
      fuelArmCm: 300,
      fuelWeightKg: 1000,
      zeroFuelCgArmCm: 250,
      zeroFuelWeightKg: 50000,
    });
    expect(result.ok && result.output.cgShiftCm).toBeLessThan(0);
  });
  it("rejects non-positive weights", () => {
    expect(
      runCgShiftFuel({
        fuelArmCm: 200,
        fuelWeightKg: 0,
        zeroFuelCgArmCm: 250,
        zeroFuelWeightKg: 50000,
      }).ok,
    ).toBe(false);
  });
});
