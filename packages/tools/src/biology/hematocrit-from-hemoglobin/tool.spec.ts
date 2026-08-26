import { describe, expect, it } from "vitest";
import { runHematocritFromHemoglobin } from "./tool.js";

describe("Rule Of Three Hct", () => {
  it("triples a normal hemoglobin of fifteen", () =>
    expect(runHematocritFromHemoglobin({ hemoglobinGDl: 15 })).toEqual({
      ok: true,
      output: { hematocritPercent: 45 },
    }));
  it("triples an anemic hemoglobin", () =>
    expect(runHematocritFromHemoglobin({ hemoglobinGDl: 10 })).toEqual({
      ok: true,
      output: { hematocritPercent: 30 },
    }));
  it("handles fractional hemoglobin values", () =>
    expect(runHematocritFromHemoglobin({ hemoglobinGDl: 13.7 })).toEqual({
      ok: true,
      output: { hematocritPercent: 41.099999999999994 },
    }));
  it("approaches zero for a vanishing hemoglobin", () =>
    expect(runHematocritFromHemoglobin({ hemoglobinGDl: 0.1 })).toEqual({
      ok: true,
      output: { hematocritPercent: 0.30000000000000004 },
    }));
  it("rejects zero hemoglobin", () => {
    const result = runHematocritFromHemoglobin({ hemoglobinGDl: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects negative hemoglobin", () => {
    const result = runHematocritFromHemoglobin({ hemoglobinGDl: -2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("hemoglobinGDl");
  });
});
