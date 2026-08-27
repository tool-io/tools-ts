import { describe, expect, it } from "vitest";
import {
  porosityFromBulkDensityExample,
  runPorosityFromBulkDensity,
} from "./tool.js";

describe("porosity-from-bulk-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPorosityFromBulkDensity(porosityFromBulkDensityExample.input),
    ).toEqual({
      ok: true,
      output: porosityFromBulkDensityExample.output,
    });
  });

  it("returns zero porosity when bulk equals grain density", () => {
    const result = runPorosityFromBulkDensity({
      bulkDensityKgPerM3: 2650,
      grainDensityKgPerM3: 2650,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.porosityFraction as number).toBe(0);
  });
  it("rejects bulk densities exceeding the grain density", () => {
    expect(
      runPorosityFromBulkDensity({
        bulkDensityKgPerM3: 3000,
        grainDensityKgPerM3: 2650,
      }).ok,
    ).toBe(false);
  });
});
