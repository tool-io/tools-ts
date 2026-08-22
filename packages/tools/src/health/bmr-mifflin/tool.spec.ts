import { describe, expect, it } from "vitest";
import { bmrMifflinExample, runBmrMifflin } from "./tool.js";

describe("BMR Mifflin St Jeor Calculator", () => {
  it("matches the canonical example", () => {
    expect(runBmrMifflin(bmrMifflinExample.input)).toEqual({
      ok: true,
      output: bmrMifflinExample.output,
    });
  });

  it("defaults sex to male", () => {
    expect(
      runBmrMifflin({ weightKg: 70, heightCm: 170, ageYears: 30 }),
    ).toEqual({
      ok: true,
      output: { bmr: 1617.5 },
    });
  });

  it("computes the female equation exactly", () => {
    expect(
      runBmrMifflin({
        weightKg: 70,
        heightCm: 170,
        ageYears: 30,
        sex: "female",
      }),
    ).toEqual({ ok: true, output: { bmr: 1451.5 } });
  });

  it("returns exact high precision results for both sexes", () => {
    expect(
      runBmrMifflin({
        weightKg: 83.4,
        heightCm: 193.2,
        ageYears: 27,
        sex: "male",
      }),
    ).toEqual({ ok: true, output: { bmr: 1911.5 } });
    expect(
      runBmrMifflin({
        weightKg: 83.4,
        heightCm: 193.2,
        ageYears: 27,
        sex: "female",
      }),
    ).toEqual({ ok: true, output: { bmr: 1745.5 } });
  });

  it("differs between sexes by exactly one hundred sixty six", () => {
    const male = runBmrMifflin({
      weightKg: 55,
      heightCm: 162,
      ageYears: 44,
      sex: "male",
    });
    const female = runBmrMifflin({
      weightKg: 55,
      heightCm: 162,
      ageYears: 44,
      sex: "female",
    });
    expect(
      male.ok && female.ok
        ? (male.output.bmr as number) - (female.output.bmr as number)
        : Number.NaN,
    ).toBe(166);
  });

  it("rejects zero weight with a stable code", () => {
    const result = runBmrMifflin({
      weightKg: 0,
      heightCm: 170,
      ageYears: 30,
      sex: "female",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_weight",
        field: "weightKg",
      });
  });

  it("rejects negative height with a stable code", () => {
    const result = runBmrMifflin({
      weightKg: 70,
      heightCm: -1,
      ageYears: 30,
      sex: "male",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_height");
  });

  it("rejects out of range and fractional ages through the schema", () => {
    const tooYoung = runBmrMifflin({
      weightKg: 70,
      heightCm: 170,
      ageYears: 0,
      sex: "male",
    });
    const tooOld = runBmrMifflin({
      weightKg: 70,
      heightCm: 170,
      ageYears: 200,
      sex: "male",
    });
    const fractional = runBmrMifflin({
      weightKg: 70,
      heightCm: 170,
      ageYears: 29.5,
      sex: "female",
    });
    expect(tooYoung.ok || tooOld.ok || fractional.ok).toBe(false);
  });

  it("rejects unknown sex values through the schema", () => {
    const result = runBmrMifflin({
      weightKg: 70,
      heightCm: 170,
      ageYears: 30,
      sex: "unknown" as never,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non object input and unknown fields", () => {
    expect(runBmrMifflin(7).ok).toBe(false);
    const result = runBmrMifflin({
      weightKg: 70,
      heightCm: 170,
      ageYears: 30,
      extra: 1,
    });
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects missing required fields", () => {
    const result = runBmrMifflin({ weightKg: 70, ageYears: 30 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("heightCm");
  });
});
