import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateDeBroglieWavelength,
  deBroglieWavelengthExample,
  deBroglieWavelengthTool,
} from "./tool.js";

describe("de Broglie wavelength", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateDeBroglieWavelength(deBroglieWavelengthExample.input),
    ).toEqual({
      ok: true,
      output: deBroglieWavelengthExample.output,
    });
  });

  it("publishes a portable example and valid pure contract", () => {
    expect(JSON.parse(JSON.stringify(deBroglieWavelengthExample))).toEqual(
      deBroglieWavelengthExample,
    );
    expect(validateToolContract(deBroglieWavelengthTool)).toEqual([]);
  });

  it("halves when either mass or speed doubles", () => {
    const input = deBroglieWavelengthExample.input;
    const base = calculateDeBroglieWavelength(input);
    const doubledMass = calculateDeBroglieWavelength({
      ...input,
      massKg: input.massKg * 2,
    });
    const doubledSpeed = calculateDeBroglieWavelength({
      ...input,
      speedMs: input.speedMs * 2,
    });
    if (!base.ok || !doubledMass.ok || !doubledSpeed.ok)
      throw new Error("expected valid wavelength calculations");
    expect(doubledMass.output.wavelengthM).toBeCloseTo(
      base.output.wavelengthM / 2,
      12,
    );
    expect(doubledSpeed.output.wavelengthM).toBeCloseTo(
      base.output.wavelengthM / 2,
      12,
    );
  });

  it("rejects malformed and non-positive inputs", () => {
    expect(calculateDeBroglieWavelength(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      calculateDeBroglieWavelength({ massKg: 1, speedMs: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "positive_finite_number_required", field: "speedMs" }],
      },
      ok: false,
    });
    expect(
      calculateDeBroglieWavelength({ massKg: Number.NaN, speedMs: 2 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "positive_finite_number_required", field: "massKg" }],
      },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      calculateDeBroglieWavelength({ massKg: 1, speedMs: 2, extra: true }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
