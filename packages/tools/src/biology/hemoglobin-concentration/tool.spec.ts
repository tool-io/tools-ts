import { describe, expect, it } from "vitest";
import {
  hemoglobinConcentrationExample,
  runHemoglobinConcentration,
} from "./tool.js";

describe("Hemoglobin From Hct Proxy", () => {
  it("publishes an executable example", () =>
    expect(
      runHemoglobinConcentration(hemoglobinConcentrationExample.input),
    ).toEqual({ ok: true, output: hemoglobinConcentrationExample.output }));
  it("applies the rule of three factor", () =>
    expect(runHemoglobinConcentration({ hematocritPercent: 40 })).toEqual({
      ok: true,
      output: { hemoglobinGDl: 13.333333333333334 },
    }));
  it("scales a low hematocrit", () =>
    expect(runHemoglobinConcentration({ hematocritPercent: 30 })).toEqual({
      ok: true,
      output: { hemoglobinGDl: 10 },
    }));
  it("scales a high hematocrit", () =>
    expect(runHemoglobinConcentration({ hematocritPercent: 60 })).toEqual({
      ok: true,
      output: { hemoglobinGDl: 20 },
    }));
  it("accepts a minimal positive hematocrit", () =>
    expect(runHemoglobinConcentration({ hematocritPercent: 0.5 })).toEqual({
      ok: true,
      output: { hemoglobinGDl: 0.16666666666666666 },
    }));
  it("rejects zero hematocrit", () => {
    const result = runHemoglobinConcentration({ hematocritPercent: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("hematocritPercent");
  });
  it("rejects negative hematocrit", () => {
    const result = runHemoglobinConcentration({ hematocritPercent: -45 });
    expect(result.ok).toBe(false);
  });
  it("rejects non-numeric input", () => {
    const result = runHemoglobinConcentration({
      hematocritPercent: "45" as unknown as number,
    });
    expect(result.ok).toBe(false);
  });
});
