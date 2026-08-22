import { describe, expect, it } from "vitest";
import {
  calculateQuickRatio,
  quickRatioExample,
  runQuickRatio,
} from "./tool.js";

describe("Quick Ratio Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQuickRatio(quickRatioExample.input)).toEqual({
      ok: true,
      output: quickRatioExample.output,
    });
  });

  it("calculates a ratio below one when liquid assets are scarce", () => {
    expect(
      calculateQuickRatio({
        cash: 10000,
        marketableSecurities: 5000,
        receivables: 20000,
        currentLiabilities: 70000,
      }),
    ).toEqual({ quickRatio: 0.5 });
  });

  it("allows negative liquid asset components", () => {
    expect(
      runQuickRatio({
        cash: -10000,
        marketableSecurities: 40000,
        receivables: 20000,
        currentLiabilities: 50000,
      }),
    ).toEqual({ ok: true, output: { quickRatio: 1 } });
  });

  it("rejects zero liabilities with invalid_current_liabilities", () => {
    expect(
      runQuickRatio({
        cash: 40000,
        marketableSecurities: 25000,
        receivables: 35000,
        currentLiabilities: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_current_liabilities", field: "currentLiabilities" },
        ],
      },
      ok: false,
    });
  });

  it("rejects negative liabilities with invalid_current_liabilities", () => {
    expect(
      runQuickRatio({
        cash: 40000,
        marketableSecurities: 25000,
        receivables: 35000,
        currentLiabilities: -50000,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite input", () => {
    const result = runQuickRatio({
      cash: Number.NaN,
      marketableSecurities: 25000,
      receivables: 35000,
      currentLiabilities: 50000,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "cash" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runQuickRatio({
        cash: 1,
        inventory: 2,
        marketableSecurities: 3,
        receivables: 4,
        currentLiabilities: 5,
      }).ok,
    ).toBe(false);
  });
});
