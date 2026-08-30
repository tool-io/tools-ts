import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateEnlargementNewScale, example } from "./tool.js";

describe("cartography/enlargement-new-scale", () => {
  it("matches its worked example", () => {
    expect(calculateEnlargementNewScale(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, originalDenominator: Number.NaN }).ok,
    ).toBe(false);
  });
});
