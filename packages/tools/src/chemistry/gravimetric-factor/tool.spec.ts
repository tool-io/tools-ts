import { describe, expect, it } from "vitest";
import { runGravimetricFactor } from "./tool.js";
describe("Gravimetric Factor", () => {
  it("calculates a valid result", () =>
    expect(
      runGravimetricFactor({
        analyteMolarMass: 58.44,
        precipitateMolarMass: 143.32,
      }),
    ).toEqual({
      ok: true,
      output: { gravimetricFactor: 0.4077588612894223 },
    }));
  it("rejects invalid input", () =>
    expect(
      runGravimetricFactor({
        analyteMolarMass: 58.44,
        precipitateMolarMass: 143.32,
        stoichiometricRatio: 0,
      }).ok,
    ).toBe(false));
});
