import { describe, expect, it } from "vitest";
import { runHeatCapacityCv } from "./tool.js";
describe("CV For Diatomic Ideal Gas", () => {
  it("calculates a valid result", () =>
    expect(runHeatCapacityCv({ temperatureK: 298 })).toEqual({
      ok: true,
      output: { cvJPerMolK: 20.786156545 },
    }));
  it("rejects invalid input", () =>
    expect(runHeatCapacityCv({ temperatureK: -1 }).ok).toBe(false));
});
