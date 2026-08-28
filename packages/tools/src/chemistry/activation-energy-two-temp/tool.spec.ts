import { describe, expect, it } from "vitest";
import { runActivationEnergyTwoTemp } from "./tool.js";
describe("Activation Energy Two-Temperature", () => {
  it("calculates a valid result", () =>
    expect(
      runActivationEnergyTwoTemp({
        rateConstant1: 0.001,
        rateConstant2: 0.01,
        temperature1: 298,
        temperature2: 308,
      }),
    ).toEqual({
      ok: true,
      output: { activationEnergyJPerMol: 175718.2438943625 },
    }));
  it("rejects invalid input", () =>
    expect(
      runActivationEnergyTwoTemp({
        rateConstant1: 0.001,
        rateConstant2: 0.01,
        temperature1: 300,
        temperature2: 300,
      }).ok,
    ).toBe(false));
});
