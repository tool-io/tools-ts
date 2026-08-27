import { describe, expect, it } from "vitest";
import {
  bulkDensityFromPorosityExample,
  runBulkDensityFromPorosity,
} from "./tool.js";

describe("bulk-density-from-porosity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBulkDensityFromPorosity(bulkDensityFromPorosityExample.input),
    ).toEqual({
      ok: true,
      output: bulkDensityFromPorosityExample.output,
    });
  });

  it("returns the grain density at zero porosity", () => {
    const result = runBulkDensityFromPorosity({
      grainDensityKgPerM3: 2650,
      porosityFraction: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.bulkDensityKgPerM3 as number).toBe(2650);
  });
  it("rejects porosity of one or more", () => {
    expect(
      runBulkDensityFromPorosity({
        grainDensityKgPerM3: 2650,
        porosityFraction: 1,
      }).ok,
    ).toBe(false);
  });
});
