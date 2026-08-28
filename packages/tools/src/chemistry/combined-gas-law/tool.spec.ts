import { describe, expect, it } from "vitest";
import { runCombinedGasLaw } from "./tool.js";
describe("Combined Gas Law Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runCombinedGasLaw({
        pressure1: 100,
        temperature1: 300,
        temperature2: 600,
        volume1: 6,
        volume2: 3,
      }),
    ).toEqual({
      ok: true,
      output: { pressure2: 400 },
    }));
  it("rejects invalid input", () =>
    expect(
      runCombinedGasLaw({
        pressure1: 100,
        temperature1: 300,
        temperature2: 0,
        volume1: 6,
        volume2: 3,
      }).ok,
    ).toBe(false));
});
