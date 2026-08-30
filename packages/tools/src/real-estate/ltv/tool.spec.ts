import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLtv, example } from "./tool.js";

describe("real-estate/ltv", () => {
  it("matches its worked example", () => {
    expect(calculateLtv(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("computes the loan share of appraised value", () => {
    expect(tool.execute({ loanAmount: 80000, appraisedValue: 100000 })).toEqual(
      { ok: true, output: { ltvPercent: 80 } },
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, loanAmount: Number.NaN }).ok).toBe(
      false,
    );
  });
});
