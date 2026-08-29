import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateScherrerEquation,
  runScherrerEquation,
  scherrerEquationExample,
  ScherrerEquationTool,
} from "./tool.js";

describe("Scherrer Equation Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runScherrerEquation(scherrerEquationExample.input)).toEqual({
      ok: true,
      output: scherrerEquationExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(ScherrerEquationTool)).toEqual([]);
  });

  it("defaults the shape factor to 0.9", () => {
    const { shapeFactorK: _shapeFactorK, ...rest } =
      scherrerEquationExample.input;
    const result = runScherrerEquation(rest);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.crystalliteSizeNm).toBe(
      scherrerEquationExample.output.crystalliteSizeNm,
    );
  });

  it("grows without bound as the peak sharpens", () => {
    expect(
      calculateScherrerEquation({
        ...scherrerEquationExample.input,
        fwhmRadians: 0.001,
      }).crystalliteSizeNm,
    ).toBeGreaterThan(scherrerEquationExample.output.crystalliteSizeNm);
  });

  it("rejects nonpositive broadening and invalid inputs", () => {
    expect(
      runScherrerEquation({
        ...scherrerEquationExample.input,
        fwhmRadians: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
    expect(
      runScherrerEquation({
        ...scherrerEquationExample.input,
        wavelengthNm: -1,
      }).ok,
    ).toBe(false);
    expect(runScherrerEquation(null).ok).toBe(false);
  });
});
