import { describe, expect, it } from "vitest";
import { runMolarMassFromVaporDensityH2 } from "./tool.js";

describe("Molar Mass From Vapor Density H2 Calculator", () => {
  it("calculates a valid result", () => {
    expect(runMolarMassFromVaporDensityH2({ vaporDensityH2: 16 })).toEqual({
      ok: true,
      output: { molarMassGMol: 32.256 },
    });
  });

  it("rejects invalid input", () =>
    expect(runMolarMassFromVaporDensityH2(null).ok).toBe(false));
});
