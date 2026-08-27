import { describe, expect, it } from "vitest";
import { redCellCountExample, runRedCellCount } from "./tool.js";

describe("Red Cell Concentration", () => {
  it("publishes an executable example", () =>
    expect(runRedCellCount(redCellCountExample.input)).toEqual({
      ok: true,
      output: redCellCountExample.output,
    }));
  it("defaults the dilution factor to two hundred", () =>
    expect(runRedCellCount({ countedCells: 2 })).toEqual({
      ok: true,
      output: { rbcMillionPerUl: 40 },
    }));
  it("scales with a custom dilution factor", () =>
    expect(runRedCellCount({ countedCells: 50, dilutionFactor: 100 })).toEqual({
      ok: true,
      output: { rbcMillionPerUl: 500 },
    }));
  it("accepts zero counted cells", () =>
    expect(runRedCellCount({ countedCells: 0 })).toEqual({
      ok: true,
      output: { rbcMillionPerUl: 0 },
    }));
  it("handles fractional counts", () =>
    expect(
      runRedCellCount({ countedCells: 12.5, dilutionFactor: 200 }),
    ).toEqual({ ok: true, output: { rbcMillionPerUl: 250 } }));
  it("requires the minimum dilution of one", () =>
    expect(runRedCellCount({ countedCells: 30, dilutionFactor: 1 })).toEqual({
      ok: true,
      output: { rbcMillionPerUl: 3 },
    }));
  it("rejects negative counts", () => {
    const result = runRedCellCount({ countedCells: -1 });
    expect(result.ok).toBe(false);
  });
  it("rejects dilution factors below one", () => {
    const result = runRedCellCount({ countedCells: 5, dilutionFactor: 0.5 });
    expect(result.ok).toBe(false);
  });
});
