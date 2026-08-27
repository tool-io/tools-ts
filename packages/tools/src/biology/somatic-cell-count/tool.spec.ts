import { describe, expect, it } from "vitest";
import { runSomaticCellCount } from "./tool.js";

describe("SCC Linear Score", () => {
  it("scores one hundred thousand cells per millilitre as three", () =>
    expect(runSomaticCellCount({ somaticCellCountCellsMl: 100000 })).toEqual({
      ok: true,
      output: { somaticCellLinearScore: 3 },
    }));
  it("doubles count adds one score point", () =>
    expect(runSomaticCellCount({ somaticCellCountCellsMl: 200000 })).toEqual({
      ok: true,
      output: { somaticCellLinearScore: 4 },
    }));
  it("quadruples count adds two score points", () =>
    expect(runSomaticCellCount({ somaticCellCountCellsMl: 400000 })).toEqual({
      ok: true,
      output: { somaticCellLinearScore: 5 },
    }));
  it("scores eight hundred thousand cells per millilitre as six", () =>
    expect(runSomaticCellCount({ somaticCellCountCellsMl: 800000 })).toEqual({
      ok: true,
      output: { somaticCellLinearScore: 6 },
    }));
  it("scores fifty thousand cells per millilitre as two", () =>
    expect(runSomaticCellCount({ somaticCellCountCellsMl: 50000 })).toEqual({
      ok: true,
      output: { somaticCellLinearScore: 2 },
    }));
  it("rejects zero cell count", () =>
    expect(runSomaticCellCount({ somaticCellCountCellsMl: 0 }).ok).toBe(false));
  it("rejects negative cell count", () =>
    expect(runSomaticCellCount({ somaticCellCountCellsMl: -1000 }).ok).toBe(
      false,
    ));
});
