import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBasalAreaSingleTree, example } from "./tool.js";

describe("forestry/basal-area-single-tree", () => {
  it("matches its worked example", () => {
    expect(calculateBasalAreaSingleTree(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("converts a 20 cm DBH to about 0.0314 square metres", () => {
    expect(
      calculateBasalAreaSingleTree({ dbhCentimeters: 20 }).basalSquareMeters,
    ).toBeCloseTo(0.0314159265, 9);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, dbhCentimeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
