import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculatePackingFraction,
  packingFractionExample,
  packingFractionTool,
} from "./tool.js";

describe("packing fraction", () => {
  it("reproduces the canonical example", () => {
    expect(calculatePackingFraction(packingFractionExample.input)).toEqual({
      ok: true,
      output: packingFractionExample.output,
    });
  });

  it("publishes a portable example and valid pure contract", () => {
    expect(JSON.parse(JSON.stringify(packingFractionExample))).toEqual(
      packingFractionExample,
    );
    expect(validateToolContract(packingFractionTool)).toEqual([]);
  });

  it("decreases when the unit-cell volume doubles", () => {
    const input = packingFractionExample.input;
    const result = calculatePackingFraction({
      ...input,
      unitCellVolumeAngstrom3: input.unitCellVolumeAngstrom3 * 2,
    });
    expect(result).toEqual({
      ok: true,
      output: { packingFraction: Math.PI / 12 },
    });
  });

  it("rejects malformed inputs and physically impossible fractions", () => {
    expect(calculatePackingFraction(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      calculatePackingFraction({
        ...packingFractionExample.input,
        atomsPerUnitCell: 1.5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "positive_safe_integer_required", field: "atomsPerUnitCell" },
        ],
      },
      ok: false,
    });
    expect(
      calculatePackingFraction({
        ...packingFractionExample.input,
        atomicRadiusAngstrom: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "packing_fraction_out_of_range", field: "packingFraction" },
        ],
      },
      ok: false,
    });
  });

  it("rejects unknown and non-finite values", () => {
    expect(
      calculatePackingFraction({
        ...packingFractionExample.input,
        extra: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    expect(
      calculatePackingFraction({
        ...packingFractionExample.input,
        unitCellVolumeAngstrom3: Number.NaN,
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
  });
});
