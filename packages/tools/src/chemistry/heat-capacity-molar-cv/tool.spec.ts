import { describe, expect, it } from "vitest";
import { runMolarHeatCapacityCv, molarHeatCapacityCvExample } from "./tool.js";
describe("Molar Cv From Cp", () => {
  it("publishes an executable example", () =>
    expect(runMolarHeatCapacityCv(molarHeatCapacityCvExample.input)).toEqual({
      ok: true,
      output: molarHeatCapacityCvExample.output,
    }));
  it("subtracts the gas constant exactly once", () =>
    expect(runMolarHeatCapacityCv({ molarCpJPerMolK: 37.114462618 })).toEqual({
      ok: true,
      output: { molarHeatCapacityCv: 28.799999999999997 },
    }));
  it("rejects Cp equal to the gas constant", () => {
    const result = runMolarHeatCapacityCv({ molarCpJPerMolK: 8.314462618 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("below_gas_minimum");
  });
  it("rejects Cp below the gas constant", () => {
    const result = runMolarHeatCapacityCv({ molarCpJPerMolK: 5 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("below_gas_minimum");
  });
});
