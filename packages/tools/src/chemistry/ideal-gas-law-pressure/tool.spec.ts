import { describe, expect, it } from "vitest";
import { runIdealGasLawPressure } from "./tool.js";
describe("Ideal Gas Pressure", () => {
  it("calculates a valid result", () =>
    expect(
      runIdealGasLawPressure({ moles: 1, temperatureK: 300, volumeM3: 1 }),
    ).toEqual({
      ok: true,
      output: { pressurePa: 2494.3387854000002 },
    }));
  it("rejects invalid input", () =>
    expect(
      runIdealGasLawPressure({ moles: 0, temperatureK: 300, volumeM3: 1 }).ok,
    ).toBe(false));
});
