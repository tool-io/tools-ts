import { describe, expect, it } from "vitest";
import { runFaradayChargeFromMoles } from "./tool.js";
describe("Charge From Moles Electrons", () => {
  it("calculates a valid result", () =>
    expect(runFaradayChargeFromMoles({ molesElectrons: 2 })).toEqual({
      ok: true,
      output: { chargeCoulombs: 192970.66424 },
    }));
  it("rejects invalid input", () =>
    expect(runFaradayChargeFromMoles({ molesElectrons: -1 }).ok).toBe(false));
});
