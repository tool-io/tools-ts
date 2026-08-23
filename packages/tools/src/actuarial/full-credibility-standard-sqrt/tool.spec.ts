import { describe, expect, it } from "vitest";
import {
  calculateFullCredibilityStandardSqrt,
  fullCredibilityStandardSqrtExample,
  runFullCredibilityStandardSqrt,
} from "./tool.js";

describe("full credibility standard sqrt calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFullCredibilityStandardSqrt(fullCredibilityStandardSqrtExample.input),
    ).toEqual({
      ok: true,
      output: fullCredibilityStandardSqrtExample.output,
    });
  });

  it("applies the square root rule to partial experience", () => {
    expect(
      calculateFullCredibilityStandardSqrt({
        fullCredibilityCount: 1600,
        observedCount: 900,
      }),
    ).toEqual({ credibilityFactor: 0.75 });
  });

  it("caps at one beyond the full credibility count", () => {
    expect(
      runFullCredibilityStandardSqrt({
        fullCredibilityCount: 1600,
        observedCount: 6400,
      }),
    ).toEqual({ ok: true, output: { credibilityFactor: 1 } });
    expect(
      runFullCredibilityStandardSqrt({
        fullCredibilityCount: 1600,
        observedCount: 0,
      }),
    ).toEqual({ ok: true, output: { credibilityFactor: 0 } });
  });

  it("rejects malformed input with field-specific issues", () => {
    expect(runFullCredibilityStandardSqrt(null)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      runFullCredibilityStandardSqrt({
        ...fullCredibilityStandardSqrtExample.input,
        unexpectedField: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpectedField" }] },
      ok: false,
    });
  });

  it("rejects degenerate credibility standards with a stable code", () => {
    expect(
      runFullCredibilityStandardSqrt({
        fullCredibilityCount: 0,
        observedCount: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "fullCredibilityCount",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects negative and non-finite counts in direct calls", () => {
    expect(() =>
      calculateFullCredibilityStandardSqrt({
        fullCredibilityCount: 1600,
        observedCount: -1,
      }),
    ).toThrowError("The observed claim count must be finite and nonnegative");
    expect(() =>
      calculateFullCredibilityStandardSqrt({
        fullCredibilityCount: Number.NaN,
        observedCount: 1,
      }),
    ).toThrowError("The full credibility count must be at least one");
    expect(() =>
      calculateFullCredibilityStandardSqrt({
        fullCredibilityCount: 1600,
        observedCount: Number.POSITIVE_INFINITY,
      }),
    ).toThrowError("The observed claim count must be finite and nonnegative");
  });
});
