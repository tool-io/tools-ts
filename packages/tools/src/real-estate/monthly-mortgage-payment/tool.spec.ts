import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateMonthlyMortgagePayment, example } from "./tool.js";

describe("real-estate/monthly-mortgage-payment", () => {
  it("matches its worked example", () => {
    expect(calculateMonthlyMortgagePayment(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("amortizes a zero-interest loan evenly", () => {
    expect(
      tool.execute({
        principal: 120000,
        annualInterestPercent: 0,
        termMonths: 120,
      }),
    ).toEqual({ ok: true, output: { monthlyPayment: 1000 } });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, principal: Number.NaN }).ok).toBe(
      false,
    );
  });
});
