import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateCo2EquivalentSingleTree, example } from "./tool.js";

describe("forestry/co2-equivalent-single-tree", () => {
  it("matches its worked example", () => {
    expect(calculateCo2EquivalentSingleTree(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, carbonKilograms: Number.NaN }).ok,
    ).toBe(false);
  });
});
