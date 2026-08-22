import { describe, expect, it } from "vitest";
import {
  calculateDebtToEquity,
  debtToEquityExample,
  runDebtToEquity,
} from "./tool.js";

describe("Debt to Equity Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDebtToEquity(debtToEquityExample.input)).toEqual({
      ok: true,
      output: debtToEquityExample.output,
    });
  });

  it("calculates a leveraged ratio for another valid input", () => {
    expect(
      calculateDebtToEquity({ totalDebt: 750000, shareholdersEquity: 250000 }),
    ).toEqual({ debtToEquity: 3 });
  });

  it("reports zero when there is no debt", () => {
    expect(
      runDebtToEquity({ totalDebt: 0, shareholdersEquity: 400000 }),
    ).toEqual({ ok: true, output: { debtToEquity: 0 } });
  });

  it("allows negative total debt", () => {
    expect(
      runDebtToEquity({ totalDebt: -100000, shareholdersEquity: 400000 }),
    ).toEqual({ ok: true, output: { debtToEquity: -0.25 } });
  });

  it("rejects zero equity with invalid_shareholders_equity", () => {
    expect(
      runDebtToEquity({ totalDebt: 300000, shareholdersEquity: 0 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_shareholders_equity", field: "shareholdersEquity" },
        ],
      },
      ok: false,
    });
  });

  it("rejects negative equity with invalid_shareholders_equity", () => {
    expect(
      runDebtToEquity({ totalDebt: 300000, shareholdersEquity: -600000 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite input", () => {
    const result = runDebtToEquity({
      totalDebt: Number.NaN,
      shareholdersEquity: 600000,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "totalDebt" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runDebtToEquity({
        assets: 1,
        totalDebt: 300000,
        shareholdersEquity: 600000,
      }).ok,
    ).toBe(false);
  });
});
