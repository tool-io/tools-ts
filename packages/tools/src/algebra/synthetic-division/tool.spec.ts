import { describe, expect, it } from "vitest";
import { syntheticDivisionExample, runSyntheticDivision } from "./tool.js";

describe("algebra/synthetic-division", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSyntheticDivision(syntheticDivisionExample.input)).toEqual({
      ok: true,
      output: syntheticDivisionExample.output,
    });
  });
  it("rejects an empty dividend with a stable code", () => {
    const result = runSyntheticDivision({
      dividendCoefficients: [],
      divisorRoot: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_polynomial",
        field: "dividendCoefficients",
      });
  });

  it("keeps a nonzero remainder", () => {
    const result = runSyntheticDivision({
      dividendCoefficients: [1, -6, 11, -6],
      divisorRoot: 5,
    });
    expect(result).toEqual({
      ok: true,
      output: { quotientCoefficients: [1, -1, 6], remainder: 24 },
    });
  });

  it("divides a constant polynomial into a zero quotient", () => {
    expect(
      runSyntheticDivision({
        dividendCoefficients: [5],
        divisorRoot: -3,
      }),
    ).toEqual({
      ok: true,
      output: { quotientCoefficients: [], remainder: 5 },
    });
  });

  it("rejects non-finite input and intermediate overflow", () => {
    expect(
      runSyntheticDivision({
        dividendCoefficients: [1, 2],
        divisorRoot: Number.NEGATIVE_INFINITY,
      }).ok,
    ).toBe(false);
    const overflow = runSyntheticDivision({
      dividendCoefficients: [Number.MAX_VALUE, 1],
      divisorRoot: 2,
    });
    expect(overflow.ok).toBe(false);
    if (!overflow.ok)
      expect(overflow.error.issues[0].code).toBe("result_not_finite");
  });
});
