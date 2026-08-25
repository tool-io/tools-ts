import { describe, expect, it } from "vitest";
import { barkThicknessRatioExample, runBarkThicknessRatio } from "./tool.js";

describe("Bark Thickness Percent", () => {
  it("matches the canonical example", () => {
    expect(runBarkThicknessRatio(barkThicknessRatioExample.input)).toEqual({
      ok: true,
      output: barkThicknessRatioExample.output,
    });
  });

  it("accepts a zero bark thickness", () => {
    expect(runBarkThicknessRatio({ barkThicknessMm: 0, dbhCm: 25 })).toEqual({
      ok: true,
      output: { barkThicknessPercent: 0 },
    });
  });

  it("ranks thin barked saplings below thick barked adults", () => {
    expect(runBarkThicknessRatio({ barkThicknessMm: 2, dbhCm: 10 })).toEqual({
      ok: true,
      output: { barkThicknessPercent: 2 },
    });
    expect(runBarkThicknessRatio({ barkThicknessMm: 40, dbhCm: 50 })).toEqual({
      ok: true,
      output: { barkThicknessPercent: 8 },
    });
  });

  it("accepts fractional measurements", () => {
    expect(runBarkThicknessRatio({ barkThicknessMm: 1.5, dbhCm: 7.5 })).toEqual(
      { ok: true, output: { barkThicknessPercent: 2 } },
    );
  });

  it("rejects a zero diameter with a stable field", () => {
    const result = runBarkThicknessRatio({
      barkThicknessMm: 10,
      dbhCm: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "dbhCm",
      });
  });

  it("rejects a negative diameter through the schema and guard", () => {
    expect(runBarkThicknessRatio({ barkThicknessMm: 10, dbhCm: -30 }).ok).toBe(
      false,
    );
  });

  it("rejects negative bark thickness through the schema", () => {
    expect(runBarkThicknessRatio({ barkThicknessMm: -1, dbhCm: 30 }).ok).toBe(
      false,
    );
  });
});
