import { describe, expect, it } from "vitest";
import { runRedCellIndexMcv } from "./tool.js";

describe("MCV Cross Check", () => {
  it("computes MCV as hematocrit times ten over RBC", () =>
    expect(
      runRedCellIndexMcv({
        hematocritPercent: 45,
        rbcMillionPerUl: 5,
        reportedMcvFemtoliters: 90,
      }),
    ).toEqual({
      ok: true,
      output: { computedMcvFemtoliters: 90, consistent: true },
    }));
  it("flags agreement within two femtolitres", () =>
    expect(
      runRedCellIndexMcv({
        hematocritPercent: 45,
        rbcMillionPerUl: 5,
        reportedMcvFemtoliters: 88,
      }),
    ).toEqual({
      ok: true,
      output: { computedMcvFemtoliters: 90, consistent: true },
    }));
  it("treats exactly two femtolitres as consistent", () =>
    expect(
      runRedCellIndexMcv({
        hematocritPercent: 45,
        rbcMillionPerUl: 5,
        reportedMcvFemtoliters: 92,
      }),
    ).toEqual({
      ok: true,
      output: { computedMcvFemtoliters: 90, consistent: true },
    }));
  it("rejects agreement beyond two femtolitres", () =>
    expect(
      runRedCellIndexMcv({
        hematocritPercent: 45,
        rbcMillionPerUl: 5,
        reportedMcvFemtoliters: 93,
      }),
    ).toEqual({
      ok: true,
      output: { computedMcvFemtoliters: 90, consistent: false },
    }));
  it("handles non integer RBC counts", () =>
    expect(
      runRedCellIndexMcv({
        hematocritPercent: 42,
        rbcMillionPerUl: 4.6,
        reportedMcvFemtoliters: 93,
      }),
    ).toEqual({
      ok: true,
      output: {
        computedMcvFemtoliters: 91.30434782608697,
        consistent: true,
      },
    }));
  it("rejects zero RBC counts", () => {
    const result = runRedCellIndexMcv({
      hematocritPercent: 45,
      rbcMillionPerUl: 0,
      reportedMcvFemtoliters: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects non positive hematocrit", () => {
    const result = runRedCellIndexMcv({
      hematocritPercent: -45,
      rbcMillionPerUl: 5,
      reportedMcvFemtoliters: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("hematocritPercent");
  });
});
