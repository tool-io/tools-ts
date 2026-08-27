import { describe, expect, it } from "vitest";
import {
  proteinEfficiencyRatioExample,
  runProteinEfficiencyRatio,
} from "./tool.js";

describe("PER Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runProteinEfficiencyRatio(proteinEfficiencyRatioExample.input),
    ).toEqual({
      ok: true,
      output: proteinEfficiencyRatioExample.output,
    }));
  it("returns zero for maintenance-level intake", () =>
    expect(
      runProteinEfficiencyRatio({ proteinConsumedG: 30, weightGainG: 0 }),
    ).toEqual({ ok: true, output: { proteinEfficiencyRatio: 0 } }));
  it("supports fractional ratios", () => {
    const result = runProteinEfficiencyRatio({
      proteinConsumedG: 25,
      weightGainG: 7.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.proteinEfficiencyRatio).toBe(0.3);
  });
  it("allows signed gains down to minus one", () =>
    expect(
      runProteinEfficiencyRatio({ proteinConsumedG: 30, weightGainG: -30 }),
    ).toEqual({ ok: true, output: { proteinEfficiencyRatio: -1 } }));
  it("rejects gains below negative the protein consumed", () => {
    const result = runProteinEfficiencyRatio({
      proteinConsumedG: 30,
      weightGainG: -31,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_weight_gain");
  });
  it("distinguishes complete and poor proteins", () => {
    const casein = runProteinEfficiencyRatio({
      proteinConsumedG: 20,
      weightGainG: 60,
    });
    const gluten = runProteinEfficiencyRatio({
      proteinConsumedG: 20,
      weightGainG: 5,
    });
    if (casein.ok && gluten.ok)
      expect(casein.output.proteinEfficiencyRatio).toBeGreaterThan(
        Number(gluten.output.proteinEfficiencyRatio),
      );
    else expect.fail("both calculations should succeed");
  });
  it("rejects zero protein consumed", () =>
    expect(
      runProteinEfficiencyRatio({ proteinConsumedG: 0, weightGainG: 10 }).ok,
    ).toBe(false));
  it("rejects negative protein consumed", () =>
    expect(
      runProteinEfficiencyRatio({ proteinConsumedG: -5, weightGainG: 10 }).ok,
    ).toBe(false));
});
