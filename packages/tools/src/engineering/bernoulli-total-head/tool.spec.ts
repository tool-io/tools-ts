import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBernoulliTotalHead, example } from "./tool.js";

describe("engineering/bernoulli-total-head", () => {
  it("matches its worked example", () => {
    expect(calculateBernoulliTotalHead(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, elevationMeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
