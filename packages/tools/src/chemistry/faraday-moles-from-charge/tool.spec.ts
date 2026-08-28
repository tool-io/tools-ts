import { describe, expect, it } from "vitest";
import { runFaradayMolesFromCharge } from "./tool.js";
describe("Moles Electrons From Charge", () => {
  it("calculates a valid result", () =>
    expect(runFaradayMolesFromCharge({ chargeCoulombs: 96485.33212 })).toEqual({
      ok: true,
      output: { molesOfElectrons: 1 },
    }));
  it("rejects invalid input", () =>
    expect(runFaradayMolesFromCharge({ chargeCoulombs: -5 }).ok).toBe(false));
});
