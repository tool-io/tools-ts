import { describe, expect, it } from "vitest";
import {
  calculateIndependentToDependentDecrement,
  independentToDependentDecrementExample,
  runIndependentToDependentDecrement,
} from "./tool.js";

describe("independent to dependent decrement converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIndependentToDependentDecrement(
        independentToDependentDecrementExample.input,
      ),
    ).toEqual({
      ok: true,
      output: independentToDependentDecrementExample.output,
    });
  });

  it("keeps dependent rates below the independent rate", () => {
    const result = calculateIndependentToDependentDecrement({
      causeIndex: 1,
      independentDecrementRates: [0.4, 0.3],
    });
    expect(result.dependentDecrementRate).toBeLessThan(0.4);
    expect(result.dependentDecrementRate).toBeGreaterThan(0);
  });

  it("returns the raw asymmetric constant-force result", () => {
    expect(
      calculateIndependentToDependentDecrement({
        causeIndex: 2,
        independentDecrementRates: [0.1, 0.2],
      }),
    ).toEqual({ dependentDecrementRate: 0.1901961060752936 });
  });

  it("returns zero when every independent decrement is zero", () => {
    expect(
      calculateIndependentToDependentDecrement({
        causeIndex: 1,
        independentDecrementRates: [0, 0],
      }),
    ).toEqual({ dependentDecrementRate: 0 });
  });

  it("rejects out-of-range cause indexes and rates of one", () => {
    expect(
      runIndependentToDependentDecrement({
        causeIndex: 5,
        independentDecrementRates: [0.5, 0.5],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_cause_index" }] },
      ok: false,
    });
    expect(
      runIndependentToDependentDecrement({
        causeIndex: 1,
        independentDecrementRates: [1, 0.2],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "independent_rate_out_of_range",
            field: "independentDecrementRates",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects fractional cause indexes in direct calls", () => {
    expect(() =>
      calculateIndependentToDependentDecrement({
        causeIndex: 1.5,
        independentDecrementRates: [0.2, 0.3],
      }),
    ).toThrowError("The cause index must point at an entry");
  });
});
