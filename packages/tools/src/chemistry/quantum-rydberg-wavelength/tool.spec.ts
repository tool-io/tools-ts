import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateRydbergWavelength,
  rydbergWavelengthExample,
  rydbergWavelengthTool,
} from "./tool.js";

describe("Rydberg wavelength", () => {
  it("reproduces the canonical example", () => {
    expect(calculateRydbergWavelength(rydbergWavelengthExample.input)).toEqual({
      ok: true,
      output: rydbergWavelengthExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(rydbergWavelengthTool)).toEqual([]);
  });

  it("rejects a reversed transition", () => {
    expect(
      calculateRydbergWavelength({
        ...rydbergWavelengthExample.input,
        lowerQuantumNumber: 3,
        upperQuantumNumber: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "quantum_number_order_invalid" }] },
      ok: false,
    });
  });
});
