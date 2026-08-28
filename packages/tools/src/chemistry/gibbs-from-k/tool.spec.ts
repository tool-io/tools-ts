import { describe, expect, it } from "vitest";
import { runGibbsFromK } from "./tool.js";
describe("Delta G From K", () => {
  it("calculates a valid result", () =>
    expect(
      runGibbsFromK({ equilibriumConstantK: 10, temperatureK: 298.15 }),
    ).toEqual({
      ok: true,
      output: { gibbsFreeEnergyKJ: -5.708009502430058 },
    }));
  it("rejects invalid input", () =>
    expect(
      runGibbsFromK({ equilibriumConstantK: -1, temperatureK: 298.15 }).ok,
    ).toBe(false));
});
