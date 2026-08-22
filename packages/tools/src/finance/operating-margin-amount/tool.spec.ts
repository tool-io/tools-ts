import { describe, expect, it } from "vitest";
import {
  calculateOperatingMarginAmount,
  operatingMarginAmountExample,
  runOperatingMarginAmount,
} from "./tool.js";

describe("Operating Margin Amount Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOperatingMarginAmount(operatingMarginAmountExample.input),
    ).toEqual({ ok: true, output: operatingMarginAmountExample.output });
  });

  it("calculates a higher margin for another valid input", () => {
    expect(
      calculateOperatingMarginAmount({
        operatingIncome: 25000,
        revenue: 100000,
      }),
    ).toEqual({ operatingMargin: 0.25 });
  });

  it("reports a negative margin when operating income is negative", () => {
    expect(
      calculateOperatingMarginAmount({
        operatingIncome: -4000,
        revenue: 80000,
      }),
    ).toEqual({ operatingMargin: -0.05 });
  });

  it("rejects zero revenue with invalid_revenue", () => {
    expect(
      runOperatingMarginAmount({ operatingIncome: 9000, revenue: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_revenue", field: "revenue" }] },
      ok: false,
    });
  });

  it("rejects negative revenue with invalid_revenue", () => {
    expect(
      runOperatingMarginAmount({ operatingIncome: 9000, revenue: -60000 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite input", () => {
    const result = runOperatingMarginAmount({
      operatingIncome: Number.NaN,
      revenue: 60000,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "operatingIncome" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runOperatingMarginAmount({
        extra: 1,
        operatingIncome: 9000,
        revenue: 60000,
      }).ok,
    ).toBe(false);
  });
});
