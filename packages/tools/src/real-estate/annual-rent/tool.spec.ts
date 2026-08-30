import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAnnualRent, example } from "./tool.js";

describe("real-estate/annual-rent", () => {
  it("matches its worked example", () => {
    expect(calculateAnnualRent(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, monthlyRent: Number.NaN }).ok).toBe(
      false,
    );
  });
});
