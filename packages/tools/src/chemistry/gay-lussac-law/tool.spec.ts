import { describe, expect, it } from "vitest";
import { runGayLussacLaw } from "./tool.js";
describe("Gay-Lussac Law Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runGayLussacLaw({
        pressure1: 101.325,
        temperature1: 273.15,
        temperature2: 546.3,
      }),
    ).toEqual({
      ok: true,
      output: { pressure2: 202.65 },
    }));
  it("rejects invalid input", () =>
    expect(
      runGayLussacLaw({
        pressure1: -1,
        temperature1: 273.15,
        temperature2: 546.3,
      }).ok,
    ).toBe(false));
});
