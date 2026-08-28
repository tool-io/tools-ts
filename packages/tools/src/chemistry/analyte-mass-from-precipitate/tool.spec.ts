import { describe, expect, it } from "vitest";
import { runAnalyteMassFromPrecipitate } from "./tool.js";
describe("Analyte Mass From Precipitate", () => {
  it("calculates a valid result", () =>
    expect(
      runAnalyteMassFromPrecipitate({
        gravimetricFactor: 0.4,
        precipitateMassG: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { analyteMassGrams: 0.2 },
    }));
  it("rejects invalid input", () =>
    expect(
      runAnalyteMassFromPrecipitate({
        gravimetricFactor: -1,
        precipitateMassG: 0.5,
      }).ok,
    ).toBe(false));
});
