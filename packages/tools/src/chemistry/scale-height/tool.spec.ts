import { describe, expect, it } from "vitest";
import { runScaleHeight } from "./tool.js";
describe("Scale Height Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runScaleHeight({ molarMassKgPerMol: 0.0289644, temperatureK: 288.15 }),
    ).toEqual({
      ok: true,
      output: { scaleHeightMeters: 8434.6603105082 },
    }));
  it("rejects invalid input", () =>
    expect(
      runScaleHeight({ molarMassKgPerMol: 0, temperatureK: 288.15 }).ok,
    ).toBe(false));
});
