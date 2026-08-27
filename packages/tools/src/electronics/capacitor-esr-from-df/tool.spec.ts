import { describe, expect, it } from "vitest";
import { capacitorEsrFromDfExample, runCapacitorEsrFromDf } from "./tool.js";
describe("ESR From Dissipation Factor", () => {
  it("publishes an executable example", () =>
    expect(runCapacitorEsrFromDf(capacitorEsrFromDfExample.input)).toEqual({
      ok: true,
      output: capacitorEsrFromDfExample.output,
    }));
  it("doubles ESR when dissipation factor doubles", () => {
    const result = runCapacitorEsrFromDf({
      dissipationFactor: 0.1,
      frequencyHz: 1000,
      capacitanceF: 0.000001,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.esrOhms).toBeCloseTo(15.915494309189533, 9);
  });
  it("rejects zero dissipation factor", () =>
    expect(
      runCapacitorEsrFromDf({
        dissipationFactor: 0,
        frequencyHz: 1000,
        capacitanceF: 1e-6,
      }).ok,
    ).toBe(false));
  it("rejects zero capacitance", () =>
    expect(
      runCapacitorEsrFromDf({
        dissipationFactor: 0.05,
        frequencyHz: 1000,
        capacitanceF: 0,
      }).ok,
    ).toBe(false));
});
