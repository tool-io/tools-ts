import { describe, expect, it } from "vitest";
import {
  calculateSolenoidInductance,
  runSolenoidInductance,
  solenoidInductanceExample,
} from "./tool.js";

describe("Solenoid Inductance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSolenoidInductance(solenoidInductanceExample.input)).toEqual({
      ok: true,
      output: solenoidInductanceExample.output,
    });
  });

  it("rejects non-positive area", () => {
    expect(
      runSolenoidInductance({
        crossSectionAreaM2: 0,
        lengthMeters: 0.1,
        turnsInt: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_area" }] },
      ok: false,
    });
  });

  it("quadruples inductance when turns double", () => {
    expect(
      calculateSolenoidInductance({
        crossSectionAreaM2: 0.001,
        lengthMeters: 0.1,
        turnsInt: 200,
      }).inductanceHenries,
    ).toBeCloseTo(solenoidInductanceExample.output.inductanceHenries * 4, 18);
  });
});
