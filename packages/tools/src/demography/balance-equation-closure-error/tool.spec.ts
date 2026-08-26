import { describe, expect, it } from "vitest";
import {
  calculateBalanceEquationClosureError,
  runBalanceEquationClosureError,
  balanceEquationClosureErrorExample,
} from "./tool.js";

describe("demography/balance-equation-closure-error", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBalanceEquationClosureError(balanceEquationClosureErrorExample.input),
    ).toEqual({ ok: true, output: balanceEquationClosureErrorExample.output });
  });

  it("detects a closed equation without residual", () => {
    const result = calculateBalanceEquationClosureError({
      populationAtStart: 2000,
      populationAtEnd: 2020,
      births: 40,
      deaths: 30,
      immigrants: 20,
      emigrants: 10,
    });
    expect(result.expectedFinalPopulation).toBe(2020);
    expect(result.closureError).toBe(0);
    expect(result.closureErrorPercent).toBe(0);
  });

  it("rejects negative flows and impossible expected populations", () => {
    expect(
      runBalanceEquationClosureError({
        populationAtStart: 100,
        populationAtEnd: 50,
        births: -1,
        deaths: 0,
        immigrants: 0,
        emigrants: 0,
      }).ok,
    ).toBe(false);
    expect(
      runBalanceEquationClosureError({
        populationAtStart: 100,
        populationAtEnd: 5,
        births: 0,
        deaths: 500,
        immigrants: 0,
        emigrants: 0,
      }).ok,
    ).toBe(false);
  });
});
