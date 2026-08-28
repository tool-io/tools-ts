import { describe, expect, it } from "vitest";
import { runEquilibriumConstantTemperatureDependenceVanHoff } from "./tool.js";
describe("Van't Hoff K2", () => {
  it("calculates a valid result", () =>
    expect(
      runEquilibriumConstantTemperatureDependenceVanHoff({
        deltaHJPerMol: -40000,
        lnK1: 2,
        temperature1: 298,
        temperature2: 308,
      }),
    ).toEqual({
      ok: true,
      output: { lnEquilibriumConstant2: 1.4758460949841261 },
    }));
  it("rejects invalid input", () =>
    expect(
      runEquilibriumConstantTemperatureDependenceVanHoff({
        deltaHJPerMol: -40000,
        lnK1: 2,
        temperature1: 298,
        temperature2: 298,
      }).ok,
    ).toBe(false));
});
