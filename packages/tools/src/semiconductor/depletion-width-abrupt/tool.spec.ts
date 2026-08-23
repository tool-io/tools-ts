import { describe, expect, it } from "vitest";
import {
  calculateDepletionWidthAbrupt,
  depletionWidthAbruptExample,
  runDepletionWidthAbrupt,
} from "./tool.js";

describe("depletion width abrupt junction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDepletionWidthAbrupt(depletionWidthAbruptExample.input)).toEqual({
      ok: true,
      output: depletionWidthAbruptExample.output,
    });
  });

  it("widens with reverse bias", () => {
    const zeroBias = calculateDepletionWidthAbrupt({
      acceptorConcentrationPerCm3: 1e16,
      builtInVoltageV: 0.7,
      donorConcentrationPerCm3: 1e18,
    }).widthUm;
    const reverseBiased = calculateDepletionWidthAbrupt({
      acceptorConcentrationPerCm3: 1e16,
      builtInVoltageV: 0.7,
      donorConcentrationPerCm3: 1e18,
      reverseBiasV: 5,
    }).widthUm;
    expect(reverseBiased).toBeGreaterThan(zeroBias);
  });

  it("returns zero only for zero total voltage", () => {
    expect(
      calculateDepletionWidthAbrupt({
        acceptorConcentrationPerCm3: 1e16,
        builtInVoltageV: 0,
        donorConcentrationPerCm3: 1e18,
      }).widthUm,
    ).toBe(0);
  });

  it("rejects non-positive concentrations", () => {
    expect(
      runDepletionWidthAbrupt({
        acceptorConcentrationPerCm3: 0,
        builtInVoltageV: 0.7,
        donorConcentrationPerCm3: 1e18,
      }).ok,
    ).toBe(false);
  });
});
