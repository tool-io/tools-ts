import { describe, expect, it } from "vitest";
import {
  calculateDependentToIndependentDecrement,
  dependentToIndependentDecrementExample,
  runDependentToIndependentDecrement,
} from "./tool.js";

describe("dependent to independent decrement converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDependentToIndependentDecrement(
        dependentToIndependentDecrementExample.input,
      ),
    ).toEqual({
      ok: true,
      output: dependentToIndependentDecrementExample.output,
    });
  });

  it("recovers the same independent rate for the second symmetric cause", () => {
    const recovered = calculateDependentToIndependentDecrement({
      causeIndex: 2,
      dependentDecrementRates: [0.375, 0.375],
    });
    expect(recovered.independentDecrementRate).toBe(0.5);
  });

  it("recovers an asymmetric textbook value under constant force", () => {
    const recovered = calculateDependentToIndependentDecrement({
      causeIndex: 2,
      dependentDecrementRates: [0.1, 0.2],
    });
    expect(recovered.independentDecrementRate).toBeCloseTo(
      0.2116264836894758,
      12,
    );
  });

  it("rejects a cause index outside the rates list", () => {
    expect(
      runDependentToIndependentDecrement({
        causeIndex: 3,
        dependentDecrementRates: [0.375, 0.375],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_cause_index", field: "causeIndex" }] },
      ok: false,
    });
  });

  it("rejects fractional cause indexes in direct calls", () => {
    expect(() =>
      calculateDependentToIndependentDecrement({
        causeIndex: 1.5,
        dependentDecrementRates: [0.2, 0.3],
      }),
    ).toThrowError("The cause index must point at an entry");
  });

  it("rejects per-cause rates outside the unit interval", () => {
    expect(
      runDependentToIndependentDecrement({
        causeIndex: 1,
        dependentDecrementRates: [1.2, 0.2],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "dependent_rate_out_of_range",
            field: "dependentDecrementRates",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects dependent totals outside the open unit interval", () => {
    expect(
      runDependentToIndependentDecrement({
        causeIndex: 1,
        dependentDecrementRates: [0.6, 0.6],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "dependent_rate_sum_invalid",
            field: "dependentDecrementRates",
          },
        ],
      },
      ok: false,
    });
    expect(
      runDependentToIndependentDecrement({
        causeIndex: 1,
        dependentDecrementRates: [0, 0],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "dependent_rate_sum_invalid",
            field: "dependentDecrementRates",
          },
        ],
      },
      ok: false,
    });
  });
});
