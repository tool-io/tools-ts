import { describe, expect, it } from "vitest";
import {
  calculateCashConversionCycle,
  cashConversionCycleExample,
  runCashConversionCycle,
} from "./tool.js";

describe("cash conversion cycle", () => {
  it("executes its canonical example exactly", () => {
    expect(runCashConversionCycle(cashConversionCycleExample.input)).toEqual({
      ok: true,
      output: cashConversionCycleExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateCashConversionCycle({
        daysInventoryOutstanding: 73,
        daysPayableOutstanding: 40,
        daysSalesOutstanding: 47,
      }),
    ).toEqual({ cashConversionCycleDays: 80 });
  });

  it("reports a negative cycle when suppliers finance operations", () => {
    expect(
      calculateCashConversionCycle({
        daysInventoryOutstanding: 20,
        daysPayableOutstanding: 90,
        daysSalesOutstanding: 30,
      }),
    ).toEqual({ cashConversionCycleDays: -40 });
  });

  it("normalizes negative zero at the exact balance point", () => {
    expect(
      calculateCashConversionCycle({
        daysInventoryOutstanding: 10,
        daysPayableOutstanding: 40,
        daysSalesOutstanding: 30,
      }).cashConversionCycleDays,
    ).toBe(0);
  });

  it("responds one-for-one to each component", () => {
    const base = calculateCashConversionCycle({
      daysInventoryOutstanding: 60,
      daysPayableOutstanding: 20,
      daysSalesOutstanding: 30,
    });
    expect(
      calculateCashConversionCycle({
        daysInventoryOutstanding: 60,
        daysPayableOutstanding: 40,
        daysSalesOutstanding: 30,
      }).cashConversionCycleDays,
    ).toBe(base.cashConversionCycleDays - 20);
  });

  it("rejects negative day counts at the schema boundary", () => {
    expect(
      runCashConversionCycle({
        daysInventoryOutstanding: 60,
        daysPayableOutstanding: -5,
        daysSalesOutstanding: 30,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "daysPayableOutstanding" }],
      },
    });
  });

  it("rejects negative and non-finite direct input", () => {
    expect(() =>
      calculateCashConversionCycle({
        daysInventoryOutstanding: 60,
        daysPayableOutstanding: 20,
        daysSalesOutstanding: -30,
      }),
    ).toThrow();
    expect(() =>
      calculateCashConversionCycle({
        daysInventoryOutstanding: Infinity,
        daysPayableOutstanding: 20,
        daysSalesOutstanding: 30,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runCashConversionCycle({
        daysInventoryOutstanding: 60,
        daysSalesOutstanding: 30,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "daysPayableOutstanding" }],
      },
    });
    expect(
      runCashConversionCycle({
        daysInventoryOutstanding: 60,
        daysPayableOutstanding: "20",
        daysSalesOutstanding: 30,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "daysPayableOutstanding" }],
      },
    });
  });
});
