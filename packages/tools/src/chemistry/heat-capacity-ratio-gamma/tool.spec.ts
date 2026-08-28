import { describe, expect, it } from "vitest";
import { runHeatCapacityRatioGamma } from "./tool.js";
describe("Gamma Heat Capacity Ratio", () => {
  it("calculates a valid result", () =>
    expect(
      runHeatCapacityRatioGamma({ cpJPerMolK: 29.1, cvJPerMolK: 20.79 }),
    ).toEqual({
      ok: true,
      output: { heatCapacityRatioGamma: 1.3997113997114 },
    }));
  it("rejects invalid input", () =>
    expect(
      runHeatCapacityRatioGamma({ cpJPerMolK: -29.1, cvJPerMolK: 20.79 }).ok,
    ).toBe(false));
});
