import { describe, expect, it } from "vitest";
import { runFugacityFromCompressibility } from "./tool.js";
describe("Fugacity From Z", () => {
  it("calculates a valid result", () =>
    expect(
      runFugacityFromCompressibility({
        compressibilityFactorZ: 0.85,
        pressureBar: 12.5,
      }),
    ).toEqual({
      ok: true,
      output: { fugacityBar: 10.758849705313223 },
    }));
  it("rejects invalid input", () =>
    expect(
      runFugacityFromCompressibility({
        compressibilityFactorZ: -1,
        pressureBar: 12.5,
      }).ok,
    ).toBe(false));
});
