import { describe, expect, it } from "vitest";
import { linearEquationExample, runLinearEquation } from "./tool.js";

describe("algebra/linear-equation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLinearEquation(linearEquationExample.input)).toEqual({
      ok: true,
      output: linearEquationExample.output,
    });
  });
  it("rejects a singular system with a stable code", () => {
    const result = runLinearEquation({
      a1: 1,
      a2: 2,
      b1: 1,
      b2: 2,
      c1: 1,
      c2: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "singular_system",
        field: "a1",
      });
  });

  it("solves another unique system", () => {
    expect(
      runLinearEquation({
        a1: 1,
        a2: 1,
        b1: 1,
        b2: -1,
        c1: 0,
        c2: 2,
      }),
    ).toEqual({
      ok: true,
      output: { determinant: -2, x: 1, y: -1 },
    });
  });

  it("accepts a unique system with a zero coefficient", () => {
    expect(
      runLinearEquation({
        a1: 0,
        a2: 3,
        b1: 2,
        b2: 0,
        c1: 8,
        c2: 9,
      }),
    ).toEqual({
      ok: true,
      output: { determinant: -6, x: 3, y: 4 },
    });
  });

  it("rejects non-finite input and determinant overflow", () => {
    expect(
      runLinearEquation({
        a1: Number.POSITIVE_INFINITY,
        a2: 1,
        b1: 1,
        b2: 1,
        c1: 1,
        c2: 1,
      }).ok,
    ).toBe(false);
    const overflow = runLinearEquation({
      a1: Number.MAX_VALUE,
      a2: 1,
      b1: 1,
      b2: Number.MAX_VALUE,
      c1: 1,
      c2: 1,
    });
    expect(overflow.ok).toBe(false);
    if (!overflow.ok)
      expect(overflow.error.issues[0].code).toBe("result_not_finite");
  });
});
