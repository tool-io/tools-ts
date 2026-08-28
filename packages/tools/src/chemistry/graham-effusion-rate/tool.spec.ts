import { describe, expect, it } from "vitest";
import { runGrahamEffusionRate } from "./tool.js";
describe("Graham Effusion Rate", () => {
  it("calculates a valid result", () =>
    expect(
      runGrahamEffusionRate({ molarMass1: 4, molarMass2: 16, rate1: 1 }),
    ).toEqual({
      ok: true,
      output: { effusionRate2: 0.5 },
    }));
  it("rejects invalid input", () =>
    expect(
      runGrahamEffusionRate({ molarMass1: 4, molarMass2: -16, rate1: 1 }).ok,
    ).toBe(false));
});
