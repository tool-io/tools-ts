import { describe, expect, it } from "vitest";
import {
  meanCorpuscularHemoglobinConcentrationExample,
  runMeanCorpuscularHemoglobinConcentration,
} from "./tool.js";

describe("MCHC Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runMeanCorpuscularHemoglobinConcentration(
        meanCorpuscularHemoglobinConcentrationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: meanCorpuscularHemoglobinConcentrationExample.output,
    }));
  it("computes another valid result", () =>
    expect(
      runMeanCorpuscularHemoglobinConcentration({
        hemoglobinGDl: 12,
        hematocritPercent: 40,
      }),
    ).toEqual({ ok: true, output: { mchcGDl: 30 } }));
  it("computes a repeating decimal", () =>
    expect(
      runMeanCorpuscularHemoglobinConcentration({
        hemoglobinGDl: 16,
        hematocritPercent: 48,
      }),
    ).toEqual({ ok: true, output: { mchcGDl: 33.333333333333336 } }));
  it("allows zero hemoglobin", () =>
    expect(
      runMeanCorpuscularHemoglobinConcentration({
        hemoglobinGDl: 0,
        hematocritPercent: 40,
      }),
    ).toEqual({ ok: true, output: { mchcGDl: 0 } }));
  it("rejects zero hematocrit", () => {
    const result = runMeanCorpuscularHemoglobinConcentration({
      hemoglobinGDl: 15,
      hematocritPercent: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative hematocrit", () => {
    const result = runMeanCorpuscularHemoglobinConcentration({
      hemoglobinGDl: 15,
      hematocritPercent: -45,
    });
    expect(result.ok).toBe(false);
  });
});
