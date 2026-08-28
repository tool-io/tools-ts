import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  BraggAngleTool,
  braggAngleExample,
  calculateBraggAngle,
  runBraggAngle,
} from "./tool.js";

describe("Bragg Angle Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runBraggAngle(braggAngleExample.input)).toEqual({
      ok: true,
      output: braggAngleExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(BraggAngleTool)).toEqual([]);
  });

  it("approaches ninety degrees at the back-reflection limit", () => {
    expect(
      calculateBraggAngle({
        diffractionOrderN: 1,
        dSpacingAngstrom: 0.77,
        wavelengthAngstrom: 1.54,
      }).braggAngleDegrees,
    ).toBeCloseTo(90, 6);
  });

  it("rejects orders with no real solution and invalid inputs", () => {
    expect(
      runBraggAngle({
        diffractionOrderN: 2,
        dSpacingAngstrom: 1.5,
        wavelengthAngstrom: 1.54,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
    expect(
      runBraggAngle({
        ...braggAngleExample.input,
        wavelengthAngstrom: -1,
      }).ok,
    ).toBe(false);
    expect(runBraggAngle(null).ok).toBe(false);
  });
});
