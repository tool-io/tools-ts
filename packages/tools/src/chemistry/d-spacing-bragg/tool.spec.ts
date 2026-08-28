import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateDSpacingBragg,
  DSpacingBraggTool,
  dSpacingBraggExample,
  runDSpacingBragg,
} from "./tool.js";

describe("D-Spacing from Bragg's Law Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runDSpacingBragg(dSpacingBraggExample.input)).toEqual({
      ok: true,
      output: dSpacingBraggExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(DSpacingBraggTool)).toEqual([]);
  });

  it("doubles the spacing for a first-order match of the full wavelength", () => {
    expect(
      calculateDSpacingBragg({
        braggAngleDegrees: 30,
        diffractionOrderN: 2,
        wavelengthAngstrom: 1.54,
      }).dSpacingAngstrom,
    ).toBeCloseTo(3.08, 9);
  });

  it("rejects degenerate angles and invalid inputs", () => {
    expect(
      runDSpacingBragg({
        ...dSpacingBraggExample.input,
        braggAngleDegrees: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
    expect(
      runDSpacingBragg({
        ...dSpacingBraggExample.input,
        wavelengthAngstrom: -0.5,
      }).ok,
    ).toBe(false);
    expect(runDSpacingBragg(null).ok).toBe(false);
  });
});
