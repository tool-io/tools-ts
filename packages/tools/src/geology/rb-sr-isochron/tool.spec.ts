import { describe, expect, it } from "vitest";
import {
  calculateRbSrIsochron,
  rbSrIsochronExample,
  runRbSrIsochron,
} from "./tool.js";

describe("rb-sr-isochron", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRbSrIsochron(rbSrIsochronExample.input)).toEqual({
      ok: true,
      output: rbSrIsochronExample.output,
    });
  });

  it("recovers the decay-constant age for a known slope", () => {
    const result = calculateRbSrIsochron({
      rbSr1: 0,
      srRatio1: 0.705,
      rbSr2: 1,
      srRatio2: 0.705 + Math.exp(1.42e-11 * 3e9) - 1,
    });
    expect(result.ageMa).toBeCloseTo(3000, 6);
  });

  it("rejects coincident abscissae", () => {
    expect(
      runRbSrIsochron({ rbSr1: 5, srRatio1: 0.71, rbSr2: 5, srRatio2: 0.72 })
        .ok,
    ).toBe(false);
  });
});
