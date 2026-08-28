import { describe, expect, it } from "vitest";
import { runAverageSpeedGas } from "./tool.js";
describe("Average Speed Gas", () => {
  it("calculates a valid result", () =>
    expect(
      runAverageSpeedGas({ molarMassKgPerMol: 0.032, temperatureK: 300 }),
    ).toEqual({
      ok: true,
      output: { averageSpeedMetersPerSecond: 445.52572733919885 },
    }));
  it("rejects invalid input", () =>
    expect(
      runAverageSpeedGas({ molarMassKgPerMol: -1, temperatureK: 300 }).ok,
    ).toBe(false));
});
