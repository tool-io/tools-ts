import { describe, expect, it } from "vitest";
import { capRateExample, runCapRate } from "./tool.js";

describe("real-estate/cap-rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCapRate(capRateExample.input)).toEqual({
      ok: true,
      output: capRateExample.output,
    });
  });

  it("scales the cap rate with net operating income", () => {
    const base = runCapRate({
      annualNetOperatingIncomeUsd: 100000,
      propertyValueUsd: 2000000,
    });
    const better = runCapRate({
      annualNetOperatingIncomeUsd: 150000,
      propertyValueUsd: 2000000,
    });
    expect(base.ok && better.ok).toBe(true);
    if (base.ok && better.ok)
      expect(better.output.capitalizationRatePercent as number).toBe(
        (base.output.capitalizationRatePercent as number) * 1.5,
      );
  });

  it("rejects non-positive property value", () => {
    expect(
      runCapRate({ annualNetOperatingIncomeUsd: 120000, propertyValueUsd: 0 })
        .ok,
    ).toBe(false);
  });
});
