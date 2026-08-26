import { describe, expect, it } from "vitest";
import { runHemoglobinA1c } from "./tool.js";

describe("HbA1c Category Lookup", () => {
  it("classifies values below 5.7 as normal", () =>
    expect(runHemoglobinA1c({ hba1cPercent: 5.4 })).toEqual({
      ok: true,
      output: { category: "normal" },
    }));
  it("classifies the prediabetes band", () =>
    expect(runHemoglobinA1c({ hba1cPercent: 6 })).toEqual({
      ok: true,
      output: { category: "prediabetes" },
    }));
  it("classifies diabetes at or above 6.5", () =>
    expect(runHemoglobinA1c({ hba1cPercent: 7.2 })).toEqual({
      ok: true,
      output: { category: "diabetes" },
    }));
  it("places exactly 5.7 in the prediabetes band", () =>
    expect(runHemoglobinA1c({ hba1cPercent: 5.7 })).toEqual({
      ok: true,
      output: { category: "prediabetes" },
    }));
  it("places exactly 6.5 in diabetes", () =>
    expect(runHemoglobinA1c({ hba1cPercent: 6.5 })).toEqual({
      ok: true,
      output: { category: "diabetes" },
    }));
  it("keeps the lower bound of three normal", () =>
    expect(runHemoglobinA1c({ hba1cPercent: 3 })).toEqual({
      ok: true,
      output: { category: "normal" },
    }));
  it("rejects values outside the supported range", () => {
    const result = runHemoglobinA1c({ hba1cPercent: 25 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
