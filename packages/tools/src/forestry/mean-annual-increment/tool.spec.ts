import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMeanAnnualIncrement, example } from "./tool.js";

describe("forestry/mean-annual-increment", () => {
  it("matches its worked example", () => {
    expect(calculateMeanAnnualIncrement(example.input)).toEqual(example.output);
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
      tool.execute({
        ...example.input,
        volumeCubicMetersPerHectare: Number.NaN,
      }).ok,
    ).toBe(false);
  });
});
