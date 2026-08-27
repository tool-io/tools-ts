import { describe, expect, it } from "vitest";
import {
  runSelectionCoefficient,
  selectionCoefficientExample,
} from "./tool.js";

describe("Selection Coefficient", () => {
  it("publishes an executable example", () =>
    expect(runSelectionCoefficient(selectionCoefficientExample.input)).toEqual({
      ok: true,
      output: selectionCoefficientExample.output,
    }));
  it("subtracts relative fitness from one", () =>
    expect(runSelectionCoefficient({ relativeFitnessW: 0.35 })).toEqual({
      ok: true,
      output: { selectionCoefficientS: 0.65 },
    }));
  it("yields zero for a maximally fit genotype", () =>
    expect(runSelectionCoefficient({ relativeFitnessW: 1 })).toEqual({
      ok: true,
      output: { selectionCoefficientS: 0 },
    }));
  it("yields one for a lethal genotype", () =>
    expect(runSelectionCoefficient({ relativeFitnessW: 0 })).toEqual({
      ok: true,
      output: { selectionCoefficientS: 1 },
    }));
  it("accepts boundary fitness values", () => {
    expect(runSelectionCoefficient({ relativeFitnessW: 0 }).ok).toBe(true);
    expect(runSelectionCoefficient({ relativeFitnessW: 1 }).ok).toBe(true);
  });
  it("rejects fitness above one", () =>
    expect(runSelectionCoefficient({ relativeFitnessW: 1.2 }).ok).toBe(false));
  it("rejects negative fitness", () =>
    expect(runSelectionCoefficient({ relativeFitnessW: -0.5 }).ok).toBe(false));
  it("rejects missing inputs", () =>
    expect(runSelectionCoefficient({}).ok).toBe(false));
});
