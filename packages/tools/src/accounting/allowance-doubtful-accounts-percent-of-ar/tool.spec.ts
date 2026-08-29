import { describe, expect, it } from "vitest";
import {
  allowanceDoubtfulExample,
  calculateAllowanceDoubtful,
  runAllowanceDoubtful,
} from "./tool.js";

describe("allowance for doubtful accounts percent of AR", () => {
  it("executes its canonical example exactly", () => {
    expect(runAllowanceDoubtful(allowanceDoubtfulExample.input)).toEqual({
      ok: true,
      output: allowanceDoubtfulExample.output,
    });
  });

  it("computes an independently known value", () => {
    expect(
      calculateAllowanceDoubtful({
        accountsReceivable: 745000,
        estimatedUncollectiblePercent: 8,
      }),
    ).toEqual({ estimatedUncollectibleAmount: 59600 });
  });

  it("computes the income-statement method example value", () => {
    expect(
      calculateAllowanceDoubtful({
        accountsReceivable: 1350000,
        estimatedUncollectiblePercent: 5,
      }),
    ).toEqual({ estimatedUncollectibleAmount: 67500 });
  });

  it("normalizes negative zero and handles zero balance", () => {
    expect(
      calculateAllowanceDoubtful({
        accountsReceivable: 0,
        estimatedUncollectiblePercent: 8,
      }).estimatedUncollectibleAmount,
    ).toBe(0);
    expect(
      calculateAllowanceDoubtful({
        accountsReceivable: 1000,
        estimatedUncollectiblePercent: 0,
      }).estimatedUncollectibleAmount,
    ).toBe(0);
  });

  it("scales linearly in receivables", () => {
    const base = calculateAllowanceDoubtful({
      accountsReceivable: 500000,
      estimatedUncollectiblePercent: 6.8,
    });
    const doubled = calculateAllowanceDoubtful({
      accountsReceivable: 1000000,
      estimatedUncollectiblePercent: 6.8,
    });
    expect(doubled.estimatedUncollectibleAmount).toBeCloseTo(
      base.estimatedUncollectibleAmount * 2,
      9,
    );
  });

  it("does not overflow while applying a 100 percent estimate", () => {
    expect(
      calculateAllowanceDoubtful({
        accountsReceivable: Number.MAX_VALUE,
        estimatedUncollectiblePercent: 100,
      }).estimatedUncollectibleAmount,
    ).toBe(Number.MAX_VALUE);
  });

  it("rejects out-of-range percentages at the schema boundary", () => {
    expect(
      runAllowanceDoubtful({
        accountsReceivable: 745000,
        estimatedUncollectiblePercent: 101,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "invalid_field", field: "estimatedUncollectiblePercent" },
        ],
      },
    });
    expect(
      runAllowanceDoubtful({
        accountsReceivable: 745000,
        estimatedUncollectiblePercent: -1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "invalid_field", field: "estimatedUncollectiblePercent" },
        ],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateAllowanceDoubtful({
        accountsReceivable: -500,
        estimatedUncollectiblePercent: 8,
      }),
    ).toThrow();
    expect(() =>
      calculateAllowanceDoubtful({
        accountsReceivable: 745000,
        estimatedUncollectiblePercent: NaN,
      }),
    ).toThrow();
  });
});
