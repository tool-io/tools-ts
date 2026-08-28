import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  betaDecayEnergyExample,
  betaDecayEnergyTool,
  calculateBetaDecayEnergy,
} from "./tool.js";

describe("beta decay energy", () => {
  it("reproduces the canonical example", () => {
    expect(calculateBetaDecayEnergy(betaDecayEnergyExample.input)).toEqual({
      ok: true,
      output: betaDecayEnergyExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(betaDecayEnergyTool)).toEqual([]);
  });

  it("rejects an unsupported decay mode", () => {
    expect(
      calculateBetaDecayEnergy({
        ...betaDecayEnergyExample.input,
        decayMode: "electron-capture",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "supported_decay_mode_required" }] },
      ok: false,
    });
  });
});
