import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateUnitCellDensity,
  runUnitCellDensity,
  unitCellDensityExample,
  UnitCellDensityTool,
} from "./tool.js";

describe("Unit Cell Density Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runUnitCellDensity(unitCellDensityExample.input)).toEqual({
      ok: true,
      output: unitCellDensityExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(UnitCellDensityTool)).toEqual([]);
  });

  it("scales linearly with molar mass and cell content", () => {
    const doubled = calculateUnitCellDensity({
      ...unitCellDensityExample.input,
      atomsPerUnitCell: 8,
    }).densityGPerCm3;
    expect(doubled).toBeCloseTo(
      2 * unitCellDensityExample.output.densityGPerCm3,
      12,
    );
  });

  it("rejects nonpositive edges and masses", () => {
    expect(
      runUnitCellDensity({
        ...unitCellDensityExample.input,
        edgeLengthPicometers: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
    expect(
      runUnitCellDensity({
        ...unitCellDensityExample.input,
        molarMassGPerMol: -1,
      }).ok,
    ).toBe(false);
    expect(runUnitCellDensity(null).ok).toBe(false);
  });
});
