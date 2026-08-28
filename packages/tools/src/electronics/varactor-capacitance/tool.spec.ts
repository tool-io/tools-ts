import { describe, expect, it } from "vitest";
import {
  calculateVaractorCapacitance,
  runVaractorCapacitance,
  varactorCapacitanceExample,
} from "./tool.js";

describe("Varactor Capacitance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVaractorCapacitance(varactorCapacitanceExample.input)).toEqual({
      ok: true,
      output: varactorCapacitanceExample.output,
    });
  });

  it("defaults to a built-in potential of 0.7 volts and grading of 0.5", () => {
    expect(
      runVaractorCapacitance({
        reverseVolts: 2.1,
        zeroBiasCapacitanceF: 1e-10,
      }),
    ).toEqual({ ok: true, output: { junctionCapacitanceF: 5e-11 } });
  });

  it("returns the zero-bias capacitance as reverse voltage approaches zero", () => {
    expect(
      calculateVaractorCapacitance({
        builtInVolts: 1,
        gammaExponent: 0.5,
        reverseVolts: 1e-12,
        zeroBiasCapacitanceF: 4e-11,
      }).junctionCapacitanceF,
    ).toBeCloseTo(4e-11, 18);
  });

  it("falls inversely with voltage for a linear grading coefficient", () => {
    expect(
      calculateVaractorCapacitance({
        builtInVolts: 1,
        gammaExponent: 1,
        reverseVolts: 9,
        zeroBiasCapacitanceF: 8e-12,
      }).junctionCapacitanceF,
    ).toBe(8e-13);
  });

  it("drops more steeply for junction abruptness above one half", () => {
    const soft = calculateVaractorCapacitance({
      builtInVolts: 1,
      gammaExponent: 0.5,
      reverseVolts: 9,
      zeroBiasCapacitanceF: 8e-12,
    }).junctionCapacitanceF;
    const hard = calculateVaractorCapacitance({
      builtInVolts: 1,
      gammaExponent: 1,
      reverseVolts: 9,
      zeroBiasCapacitanceF: 8e-12,
    }).junctionCapacitanceF;
    expect(hard).toBeLessThan(soft);
  });

  it("rejects grading coefficient outside its range through execution", () => {
    expect(
      runVaractorCapacitance({
        gammaExponent: 2.5,
        reverseVolts: 1,
        zeroBiasCapacitanceF: 1e-10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "gammaExponent" }] },
      ok: false,
    });
  });

  it("rejects zero bias capacitance with a stable code", () => {
    expect(
      runVaractorCapacitance({ reverseVolts: 1, zeroBiasCapacitanceF: 0 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_capacitance", field: "zeroBiasCapacitanceF" },
        ],
      },
      ok: false,
    });
  });

  it("guards the direct helper against non-positive built-in potential", () => {
    expect(() =>
      calculateVaractorCapacitance({
        builtInVolts: 0,
        reverseVolts: 1,
        zeroBiasCapacitanceF: 1e-10,
      }),
    ).toThrowError();
  });
});
