import { describe, expect, it } from "vitest";
import {
  meanCorpuscularHemoglobinExample,
  runMeanCorpuscularHemoglobin,
} from "./tool.js";

describe("MCH Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runMeanCorpuscularHemoglobin(meanCorpuscularHemoglobinExample.input),
    ).toEqual({
      ok: true,
      output: meanCorpuscularHemoglobinExample.output,
    }));
  it("computes another valid result", () =>
    expect(
      runMeanCorpuscularHemoglobin({ hemoglobinGDl: 12, rbcMillionPerUl: 4 }),
    ).toEqual({ ok: true, output: { mchPicograms: 30 } }));
  it("handles fractional counts", () =>
    expect(
      runMeanCorpuscularHemoglobin({ hemoglobinGDl: 10, rbcMillionPerUl: 3.2 }),
    ).toEqual({ ok: true, output: { mchPicograms: 31.25 } }));
  it("allows zero hemoglobin", () =>
    expect(
      runMeanCorpuscularHemoglobin({ hemoglobinGDl: 0, rbcMillionPerUl: 5 }),
    ).toEqual({ ok: true, output: { mchPicograms: 0 } }));
  it("rejects zero red cell count", () => {
    const result = runMeanCorpuscularHemoglobin({
      hemoglobinGDl: 15,
      rbcMillionPerUl: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative red cell count", () => {
    const result = runMeanCorpuscularHemoglobin({
      hemoglobinGDl: 15,
      rbcMillionPerUl: -5,
    });
    expect(result.ok).toBe(false);
  });
});
