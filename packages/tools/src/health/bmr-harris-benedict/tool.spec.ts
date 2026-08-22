import { describe, expect, it } from "vitest";
import { bmrHarrisBenedictExample, runBmrHarrisBenedict } from "./tool.js";

describe("BMR Harris Benedict Calculator", () => {
  it("matches the canonical example", () => {
    expect(runBmrHarrisBenedict(bmrHarrisBenedictExample.input)).toEqual({
      ok: true,
      output: bmrHarrisBenedictExample.output,
    });
  });

  it("defaults sex to male", () => {
    expect(
      runBmrHarrisBenedict({ weightKg: 70, heightCm: 170, ageYears: 30 }),
    ).toEqual(
      runBmrHarrisBenedict({
        weightKg: 70,
        heightCm: 170,
        ageYears: 30,
        sex: "male",
      }),
    );
  });

  it("computes the female equation exactly", () => {
    expect(
      runBmrHarrisBenedict({
        weightKg: 60,
        heightCm: 165,
        ageYears: 28,
        sex: "female",
      }),
    ).toEqual({ ok: true, output: { bmr: 1392.343 } });
  });

  it("returns an exact high precision result", () => {
    expect(
      runBmrHarrisBenedict({
        weightKg: 72.5,
        heightCm: 168.3,
        ageYears: 41,
        sex: "male",
      }),
    ).toEqual({ ok: true, output: { bmr: 1634.5592000000001 } });
  });

  it("decreases with age for identical body size", () => {
    const younger = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: 170,
      ageYears: 25,
      sex: "female",
    });
    const older = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: 170,
      ageYears: 75,
      sex: "female",
    });
    expect(
      younger.ok && older.ok
        ? (older.output.bmr as number) < (younger.output.bmr as number)
        : false,
    ).toBe(true);
  });

  it("rejects zero weight with a stable code", () => {
    const result = runBmrHarrisBenedict({
      weightKg: 0,
      heightCm: 170,
      ageYears: 30,
      sex: "male",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_weight",
        field: "weightKg",
      });
  });

  it("rejects negative height with a stable code", () => {
    const result = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: -170,
      ageYears: 30,
      sex: "male",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_height");
  });

  it("rejects out of range ages through the schema", () => {
    const tooYoung = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: 170,
      ageYears: 0,
      sex: "male",
    });
    const tooOld = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: 170,
      ageYears: 121,
      sex: "male",
    });
    const fractional = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: 170,
      ageYears: 30.5,
      sex: "male",
    });
    expect(tooYoung.ok && tooOld.ok && fractional.ok ? true : false).toBe(
      false,
    );
  });

  it("rejects unknown sex values through the schema", () => {
    const result = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: 170,
      ageYears: 30,
      sex: "other" as never,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non object input", () =>
    expect(runBmrHarrisBenedict(null).ok).toBe(false));

  it("rejects unknown fields and missing required fields", () => {
    const unknown = runBmrHarrisBenedict({
      weightKg: 70,
      heightCm: 170,
      ageYears: 30,
      extra: 1,
    });
    const missing = runBmrHarrisBenedict({ heightCm: 170, ageYears: 30 });
    expect(unknown.ok).toBe(false);
    if (!unknown.ok)
      expect(unknown.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.error.issues[0].field).toBe("weightKg");
  });
});
