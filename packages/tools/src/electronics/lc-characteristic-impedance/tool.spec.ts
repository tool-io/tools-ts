import { describe, expect, it } from "vitest";
import {
  calculateLcCharacteristicImpedance,
  lcCharacteristicImpedanceExample,
  runLcCharacteristicImpedance,
} from "./tool.js";

describe("LC Characteristic Impedance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLcCharacteristicImpedance(lcCharacteristicImpedanceExample.input),
    ).toEqual({
      ok: true,
      output: lcCharacteristicImpedanceExample.output,
    });
  });

  it("rejects non-positive capacitance", () => {
    expect(
      runLcCharacteristicImpedance({ capacitanceF: 0, inductanceH: 0.001 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_capacitance" }] },
      ok: false,
    });
  });

  it("squares with a tenfold impedance ratio per hundredfold L/C ratio", () => {
    expect(
      calculateLcCharacteristicImpedance({
        capacitanceF: 1e-10,
        inductanceH: 0.001,
      }).characteristicImpedanceOhms,
    ).toBeCloseTo(
      Math.sqrt(
        lcCharacteristicImpedanceExample.input.inductanceH /
          lcCharacteristicImpedanceExample.input.capacitanceF,
      ) * Math.sqrt(10),
      12,
    );
  });
});
