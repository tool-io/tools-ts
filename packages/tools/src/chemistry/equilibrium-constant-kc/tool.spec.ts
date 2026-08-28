import { describe, expect, it } from "vitest";
import { runEquilibriumConstantKc } from "./tool.js";
describe("Kc From Equilibrium Conc", () => {
  it("calculates a valid result", () =>
    expect(
      runEquilibriumConstantKc({
        exponentP: 2,
        exponentR: 1,
        productConc: 4,
        reactantConc: 2,
      }),
    ).toEqual({
      ok: true,
      output: { kc: 8 },
    }));
  it("rejects invalid input", () =>
    expect(
      runEquilibriumConstantKc({
        exponentP: 2,
        exponentR: 1,
        productConc: -1,
        reactantConc: 2,
      }).ok,
    ).toBe(false));
});
