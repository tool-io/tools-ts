import { describe, expect, it } from "vitest";
import { calculateDiodeIdealityFactor, diodeIdealityFactorExample, runDiodeIdealityFactor } from "./tool.js";

describe("diode ideality factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiodeIdealityFactor(diodeIdealityFactorExample.input)).toEqual({
      ok: true,
      output: diodeIdealityFactorExample.output,
    });
  });

  it("returns exactly one for an ideal decade at one thermal voltage per ln(10)", () => {
    const vt = (1.380649e-23 * 300) / 1.602176634e-19;
    expect(
      calculateDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        temperatureK: 300,
        voltageOneV: 0.6,
        voltageTwoV: 0.6 + vt * Math.log(10),
      }).idealityFactor,
    ).toBeCloseTo(1, 12);
  });

  it("rejects equal currents through execution", () => {
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 5,
        currentTwoMa: 5,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }),
    ).toMatchObject({ error: { issues: [{ code: "invalid_currents" }] }, ok: false });
  });
});
