import { describe, expect, it } from "vitest";
import {
  calculateDensityFromUnitCell,
  densityFromUnitCellExample,
  densityFromUnitCellTool,
} from "./tool.js";

describe("density from unit cell", () => {
  it("reproduces the canonical example exactly", () => {
    expect(
      calculateDensityFromUnitCell(densityFromUnitCellExample.input),
    ).toEqual({
      ok: true,
      output: densityFromUnitCellExample.output,
    });
  });

  it("publishes a JSON-portable example and pure contract", () => {
    expect(JSON.parse(JSON.stringify(densityFromUnitCellExample))).toEqual(
      densityFromUnitCellExample,
    );
    expect(densityFromUnitCellTool).toMatchObject({
      contractVersion: 1,
      execution: { kind: "pure" },
      id: "chemistry/crystallography-density-from-unit-cell",
    });
  });

  it("scales with formula units and molar mass and inversely with volume", () => {
    const input = densityFromUnitCellExample.input;
    const base = calculateDensityFromUnitCell(input);
    const doubledFormulaUnits = calculateDensityFromUnitCell({
      ...input,
      formulaUnitsPerCell: input.formulaUnitsPerCell * 2,
    });
    const doubledMolarMass = calculateDensityFromUnitCell({
      ...input,
      molarMassGPerMol: input.molarMassGPerMol * 2,
    });
    const doubledVolume = calculateDensityFromUnitCell({
      ...input,
      unitCellVolumeAngstrom3: input.unitCellVolumeAngstrom3 * 2,
    });

    if (!base.ok || !doubledFormulaUnits.ok || !doubledMolarMass.ok)
      throw new Error("expected valid density calculations");
    if (!doubledVolume.ok) throw new Error("expected valid volume calculation");

    expect(doubledFormulaUnits.output.densityGPerCm3).toBeCloseTo(
      base.output.densityGPerCm3 * 2,
      12,
    );
    expect(doubledMolarMass.output.densityGPerCm3).toBeCloseTo(
      base.output.densityGPerCm3 * 2,
      12,
    );
    expect(doubledVolume.output.densityGPerCm3).toBeCloseTo(
      base.output.densityGPerCm3 / 2,
      12,
    );
  });

  it("rejects malformed and non-positive inputs with stable issues", () => {
    expect(calculateDensityFromUnitCell(undefined)).toMatchObject({
      error: { code: "invalid_input", issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      calculateDensityFromUnitCell({
        ...densityFromUnitCellExample.input,
        unitCellVolumeAngstrom3: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_finite_number_required",
            field: "unitCellVolumeAngstrom3",
          },
        ],
      },
      ok: false,
    });
    expect(
      calculateDensityFromUnitCell({
        ...densityFromUnitCellExample.input,
        formulaUnitsPerCell: 1.5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_safe_integer_required",
            field: "formulaUnitsPerCell",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects unknown, non-finite, and overflowing values", () => {
    expect(
      calculateDensityFromUnitCell({
        ...densityFromUnitCellExample.input,
        extra: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    expect(
      calculateDensityFromUnitCell({
        ...densityFromUnitCellExample.input,
        molarMassGPerMol: Number.NaN,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "positive_finite_number_required",
            field: "molarMassGPerMol",
          },
        ],
      },
      ok: false,
    });
    expect(
      calculateDensityFromUnitCell({
        formulaUnitsPerCell: Number.MAX_SAFE_INTEGER,
        molarMassGPerMol: Number.MAX_VALUE,
        unitCellVolumeAngstrom3: Number.MIN_VALUE,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_output", field: "densityGPerCm3" }] },
      ok: false,
    });
  });
});
