import { describe, expect, it } from "vitest";
import { runHeatCapacityCp } from "./tool.js";
describe("CP Minus CV", () => {
  it("calculates a valid result", () =>
    expect(runHeatCapacityCp({ temperatureK: 300 })).toEqual({
      ok: true,
      output: { cpMinusCvJPerMolK: 8.314462618 },
    }));
  it("rejects invalid input", () =>
    expect(runHeatCapacityCp({ temperatureK: 0 }).ok).toBe(false));
});
