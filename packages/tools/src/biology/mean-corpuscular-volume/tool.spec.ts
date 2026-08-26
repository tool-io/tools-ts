import { describe, expect, it } from "vitest";
import {
  meanCorpuscularVolumeExample,
  runMeanCorpuscularVolume,
} from "./tool.js";

describe("MCV Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runMeanCorpuscularVolume(meanCorpuscularVolumeExample.input),
    ).toEqual({
      ok: true,
      output: meanCorpuscularVolumeExample.output,
    }));
  it("computes another valid result", () =>
    expect(
      runMeanCorpuscularVolume({ hematocritPercent: 40, rbcMillionPerUl: 4 }),
    ).toEqual({ ok: true, output: { mcvFemtoliters: 100 } }));
  it("handles low hematocrit", () =>
    expect(
      runMeanCorpuscularVolume({ hematocritPercent: 30, rbcMillionPerUl: 2.5 }),
    ).toEqual({ ok: true, output: { mcvFemtoliters: 120 } }));
  it("rejects zero hematocrit", () => {
    const result = runMeanCorpuscularVolume({
      hematocritPercent: 0,
      rbcMillionPerUl: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero red cell count", () => {
    const result = runMeanCorpuscularVolume({
      hematocritPercent: 45,
      rbcMillionPerUl: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative inputs", () => {
    const result = runMeanCorpuscularVolume({
      hematocritPercent: -45,
      rbcMillionPerUl: 5,
    });
    expect(result.ok).toBe(false);
  });
});
