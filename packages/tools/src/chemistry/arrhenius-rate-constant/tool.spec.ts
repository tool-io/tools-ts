import { describe, expect, it } from "vitest";
import { runArrheniusRateConstant } from "./tool.js";
describe("Arrhenius Rate Constant", () => {
  it("calculates a valid result", () =>
    expect(
      runArrheniusRateConstant({
        activationEnergyJPerMol: 50000,
        frequencyFactorPerS: 1e13,
        temperatureK: 300,
      }),
    ).toEqual({
      ok: true,
      output: { rateConstantPerS: 19696.844050928685 },
    }));
  it("rejects invalid input", () =>
    expect(
      runArrheniusRateConstant({
        activationEnergyJPerMol: -1,
        frequencyFactorPerS: 1e13,
        temperatureK: 300,
      }).ok,
    ).toBe(false));
});
