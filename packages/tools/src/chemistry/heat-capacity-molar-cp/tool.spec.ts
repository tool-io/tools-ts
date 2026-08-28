import { describe, expect, it } from "vitest";
import { runMolarHeatCapacityCp, molarHeatCapacityCpExample } from "./tool.js";
describe("Molar Cp Input Validation", () => {
  it("publishes an executable example", () =>
    expect(runMolarHeatCapacityCp(molarHeatCapacityCpExample.input)).toEqual({
      ok: true,
      output: molarHeatCapacityCpExample.output,
    }));
  it("passes water's value through unchanged", () =>
    expect(runMolarHeatCapacityCp({ molarCpJPerMolK: 75.3 })).toEqual({
      ok: true,
      output: { molarHeatCapacityCp: 75.3 },
    }));
  it("accepts the upper bound of five hundred", () =>
    expect(runMolarHeatCapacityCp({ molarCpJPerMolK: 500 })).toEqual({
      ok: true,
      output: { molarHeatCapacityCp: 500 },
    }));
  it("rejects zero", () =>
    expect(runMolarHeatCapacityCp({ molarCpJPerMolK: 0 }).ok).toBe(false));
  it("rejects negative values", () =>
    expect(runMolarHeatCapacityCp({ molarCpJPerMolK: -5 }).ok).toBe(false));
  it("accepts heat capacities above five hundred", () =>
    expect(runMolarHeatCapacityCp({ molarCpJPerMolK: 500.5 })).toEqual({
      ok: true,
      output: { molarHeatCapacityCp: 500.5 },
    }));
});
