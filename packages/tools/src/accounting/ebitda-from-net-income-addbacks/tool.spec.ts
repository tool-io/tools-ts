import { describe, expect, it } from "vitest";
import { calculateEbitda, ebitdaExample, runEbitda } from "./tool.js";

describe("EBITDA from net income addbacks", () => {
  it("executes its canonical example exactly", () => {
    expect(runEbitda(ebitdaExample.input)).toEqual({
      ok: true,
      output: ebitdaExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateEbitda({
        amortization: 1000,
        depreciation: 4000,
        incomeTaxExpense: 5000,
        interestExpense: 2500,
        netIncome: 12500,
      }),
    ).toEqual({ ebitda: 25000 });
  });

  it("equals net income when all addbacks are zero", () => {
    expect(
      calculateEbitda({
        amortization: 0,
        depreciation: 0,
        incomeTaxExpense: 0,
        interestExpense: 0,
        netIncome: 48000,
      }),
    ).toEqual({ ebitda: 48000 });
  });

  it("handles a net loss and normalizes negative zero", () => {
    expect(
      calculateEbitda({
        amortization: 0,
        depreciation: 5000,
        incomeTaxExpense: 0,
        interestExpense: 0,
        netIncome: -3000,
      }),
    ).toEqual({ ebitda: 2000 });
    expect(
      calculateEbitda({
        amortization: 0,
        depreciation: 0,
        incomeTaxExpense: 0,
        interestExpense: 0,
        netIncome: -0,
      }).ebitda,
    ).toBe(0);
  });

  it("is order-independent in its addbacks", () => {
    const a = calculateEbitda({
      amortization: 5000,
      depreciation: 20000,
      incomeTaxExpense: 10000,
      interestExpense: 2000,
      netIncome: 35000,
    });
    const b = calculateEbitda({
      amortization: 2000,
      depreciation: 10000,
      incomeTaxExpense: 5000,
      interestExpense: 35000,
      netIncome: 20000,
    });
    expect(a.ebitda).toBe(b.ebitda);
  });

  it("rejects malformed runtime input", () => {
    expect(
      runEbitda({
        amortization: 5000,
        depreciation: 20000,
        incomeTaxExpense: 10000,
        interestExpense: 2000,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "netIncome" }] },
    });
    expect(
      runEbitda({
        amortization: 5000,
        depreciation: "20000",
        incomeTaxExpense: 10000,
        interestExpense: 2000,
        netIncome: 35000,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "depreciation" }] },
    });
  });

  it("rejects non-finite direct input", () => {
    expect(() =>
      calculateEbitda({
        amortization: NaN,
        depreciation: 20000,
        incomeTaxExpense: 10000,
        interestExpense: 2000,
        netIncome: 35000,
      }),
    ).toThrow();
  });
});
