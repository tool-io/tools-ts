import { describe, expect, it } from "vitest";
import {
  calculateLuHfIsochron,
  luHfIsochronExample,
  runLuHfIsochron,
} from "./tool.js";

describe("lu-hf-isochron", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLuHfIsochron(luHfIsochronExample.input)).toEqual({
      ok: true,
      output: luHfIsochronExample.output,
    });
  });

  it("recovers the decay-constant age for a known slope", () => {
    const result = calculateLuHfIsochron({
      luHf1: 0,
      hfRatio1: 0.283,
      luHf2: 1,
      hfRatio2: 0.283 + Math.exp(1.865e-11 * 5e8) - 1,
    });
    expect(result.ageMa).toBeCloseTo(500, 6);
  });

  it("rejects coincident abscissae", () => {
    expect(
      runLuHfIsochron({
        luHf1: 0.02,
        hfRatio1: 0.2826,
        luHf2: 0.02,
        hfRatio2: 0.2829,
      }).ok,
    ).toBe(false);
  });
});
