import { describe, expect, it } from "vitest";
import { runSelectionDifferential } from "./tool.js";

describe("Selection Differential", () => {
  it("measures upward selection", () =>
    expect(
      runSelectionDifferential({
        meanSelectedParents: 180.5,
        populationMean: 170.5,
      }),
    ).toEqual({ ok: true, output: { selectionDifferential: 10 } }));
  it("returns a negative value for downward selection", () =>
    expect(
      runSelectionDifferential({
        meanSelectedParents: 165,
        populationMean: 172.5,
      }),
    ).toEqual({ ok: true, output: { selectionDifferential: -7.5 } }));
  it("returns zero when selected parents match the population", () =>
    expect(
      runSelectionDifferential({
        meanSelectedParents: 170.5,
        populationMean: 170.5,
      }),
    ).toEqual({ ok: true, output: { selectionDifferential: 0 } }));
  it("keeps fractional differences exact", () =>
    expect(
      runSelectionDifferential({
        meanSelectedParents: 181.25,
        populationMean: 175.5,
      }),
    ).toEqual({ ok: true, output: { selectionDifferential: 5.75 } }));
  it("supports integer measurements", () =>
    expect(
      runSelectionDifferential({
        meanSelectedParents: 190,
        populationMean: 178,
      }),
    ).toEqual({ ok: true, output: { selectionDifferential: 12 } }));
  it("supports negative trait values", () =>
    expect(
      runSelectionDifferential({
        meanSelectedParents: -2.5,
        populationMean: -5.5,
      }),
    ).toEqual({ ok: true, output: { selectionDifferential: 3 } }));
});
