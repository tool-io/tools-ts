import { describe, expect, it } from "vitest";
import {
  calculateFuturesTriangleBalance,
  futuresTriangleExample,
  runFuturesTriangle,
} from "./tool.js";

describe("futures triangle force balance", () => {
  it("reproduces its canonical example", () => {
    expect(runFuturesTriangle(futuresTriangleExample.input)).toEqual({
      ok: true,
      output: futuresTriangleExample.output,
    });
  });

  it("reports pull dominance", () => {
    expect(
      calculateFuturesTriangleBalance({
        pullStrengths: [10],
        pushStrengths: [2],
        weightStrengths: [3],
      }).dominantForce,
    ).toBe("pull");
  });

  it("reports balance when all totals are equal", () => {
    expect(
      calculateFuturesTriangleBalance({
        pullStrengths: [5],
        pushStrengths: [2],
        weightStrengths: [3],
      }),
    ).toMatchObject({ balanceDifference: 0, dominantForce: "balance" });
  });

  it("rejects a negative strength", () => {
    expect(
      runFuturesTriangle({
        pullStrengths: [1],
        pushStrengths: [-1],
        weightStrengths: [1],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_strength", field: "pushStrengths.0" }],
      },
      ok: false,
    });
  });
});
