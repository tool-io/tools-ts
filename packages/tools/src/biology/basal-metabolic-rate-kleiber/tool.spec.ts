import { describe, expect, it } from "vitest";
import { runBasalMetabolicRateKleiber } from "./tool.js";

describe("Kleiber BMR", () => {
  it("calculates a valid result", () =>
    expect(runBasalMetabolicRateKleiber({ bodyMassKg: 70 })).toEqual({
      ok: true,
      output: { basalMetabolicRateKcal: 1694.031844745511 },
    }));
  it("uses seventy kilocalories per day per kilogram raised to three quarters", () => {
    const result = runBasalMetabolicRateKleiber({ bodyMassKg: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.basalMetabolicRateKcal).toBe(70);
  });
  it("raises metabolic rate by four to the three quarters when mass quadruples", () => {
    const small = runBasalMetabolicRateKleiber({ bodyMassKg: 10 });
    const large = runBasalMetabolicRateKleiber({ bodyMassKg: 40 });
    expect(small.ok && large.ok).toBe(true);
    if (small.ok && large.ok)
      expect(
        Number(large.output.basalMetabolicRateKcal) /
          Number(small.output.basalMetabolicRateKcal),
      ).toBeCloseTo(Math.pow(4, 0.75), 12);
  });
  it("handles shrew-sized masses", () => {
    const result = runBasalMetabolicRateKleiber({ bodyMassKg: 0.02 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.basalMetabolicRateKcal).toBeGreaterThan(0);
  });
  it("rejects zero body mass", () =>
    expect(runBasalMetabolicRateKleiber({ bodyMassKg: 0 }).ok).toBe(false));
  it("rejects negative body mass", () =>
    expect(runBasalMetabolicRateKleiber({ bodyMassKg: -5 }).ok).toBe(false));
});
