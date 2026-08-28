import { describe, expect, it } from "vitest";
import { runAtomEconomy } from "./tool.js";
describe("Atom Economy Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runAtomEconomy({
        molarMassDesiredProduct: 32,
        sumMolarMassAllProducts: 80,
      }),
    ).toEqual({
      ok: true,
      output: { atomEconomyPercent: 40 },
    }));
  it("rejects invalid input", () =>
    expect(
      runAtomEconomy({
        molarMassDesiredProduct: 90,
        sumMolarMassAllProducts: 80,
      }).ok,
    ).toBe(false));
});
