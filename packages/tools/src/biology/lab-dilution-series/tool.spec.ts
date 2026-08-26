import { describe, expect, it } from "vitest";
import { runLabDilutionSeries } from "./tool.js";

describe("Lab Dilution Series Step", () => {
  it("calculates a valid result with the default ratio", () =>
    expect(runLabDilutionSeries({ previousConc: 100 })).toEqual({
      ok: true,
      output: { dilutedConcentration: 50 },
    }));
  it("reproduces the default with an explicit ratio", () => {
    const implicit = runLabDilutionSeries({ previousConc: 100 });
    const explicit = runLabDilutionSeries({
      previousConc: 100,
      transferRatio: 0.5,
    });
    expect(explicit).toEqual(implicit);
  });
  it("supports quarter-fold transfers", () => {
    const result = runLabDilutionSeries({
      previousConc: 80,
      transferRatio: 0.25,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.dilutedConcentration).toBe(20);
  });
  it("scales proportionally with the incoming concentration", () => {
    const a = runLabDilutionSeries({ previousConc: 40, transferRatio: 0.1 });
    const b = runLabDilutionSeries({ previousConc: 80, transferRatio: 0.1 });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok)
      expect(
        Number(b.output.dilutedConcentration) /
          Number(a.output.dilutedConcentration),
      ).toBe(2);
  });
  it("rejects a transfer ratio of one", () =>
    expect(
      runLabDilutionSeries({ previousConc: 100, transferRatio: 1 }).ok,
    ).toBe(false));
  it("rejects a transfer ratio of zero", () =>
    expect(
      runLabDilutionSeries({ previousConc: 100, transferRatio: 0 }).ok,
    ).toBe(false));
  it("rejects non-positive concentrations", () => {
    expect(runLabDilutionSeries({ previousConc: 0 }).ok).toBe(false);
    expect(runLabDilutionSeries({ previousConc: -100 }).ok).toBe(false);
  });
});
