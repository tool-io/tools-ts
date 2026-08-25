import { describe, expect, it } from "vitest";
import { egfrCkdEpiExample, runEgfrCkdEpi } from "./tool.js";

describe("2021 CKD-EPI eGFR", () => {
  it("matches the canonical example", () => {
    expect(runEgfrCkdEpi(egfrCkdEpiExample.input)).toEqual({
      ok: true,
      output: egfrCkdEpiExample.output,
    });
  });

  it("computes the male equation without a multiplier", () => {
    expect(
      runEgfrCkdEpi({
        serumCreatinineMgDl: 1,
        ageYears: 40,
        sex: "male",
      }),
    ).toEqual({ ok: true, output: { egfrMlPerMin: 97.57511057093221 } });
  });

  it("computes another exact value for an adult male", () => {
    expect(
      runEgfrCkdEpi({
        serumCreatinineMgDl: 1.5,
        ageYears: 70,
        sex: "male",
      }),
    ).toEqual({ ok: true, output: { egfrMlPerMin: 49.773629820505356 } });
  });

  it("uses the sex-specific creatinine spline", () => {
    const male = runEgfrCkdEpi({
      serumCreatinineMgDl: 1,
      ageYears: 40,
      sex: "male",
    });
    const female = runEgfrCkdEpi({
      serumCreatinineMgDl: 1,
      ageYears: 40,
      sex: "female",
    });
    expect(male.ok && female.ok).toBe(true);
    if (male.ok && female.ok) {
      expect(male.output.egfrMlPerMin).toBeCloseTo(97.57511057093221, 10);
      expect(female.output.egfrMlPerMin).toBeCloseTo(73.03755078319787, 10);
    }
  });

  it("rejects zero serum creatinine through the schema", () => {
    const result = runEgfrCkdEpi({
      serumCreatinineMgDl: 0,
      ageYears: 40,
      sex: "female",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "serumCreatinineMgDl",
      });
  });

  it("rejects negative serum creatinine through the schema", () => {
    const result = runEgfrCkdEpi({
      serumCreatinineMgDl: -1,
      ageYears: 40,
      sex: "male",
    });
    expect(result.ok).toBe(false);
  });

  it("rejects out of range and fractional ages through the schema", () => {
    expect(
      runEgfrCkdEpi({
        serumCreatinineMgDl: 1,
        ageYears: 17,
        sex: "male",
      }).ok,
    ).toBe(false);
    expect(
      runEgfrCkdEpi({
        serumCreatinineMgDl: 1,
        ageYears: 200,
        sex: "male",
      }).ok,
    ).toBe(false);
    expect(
      runEgfrCkdEpi({
        serumCreatinineMgDl: 1,
        ageYears: 39.5,
        sex: "male",
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and missing required input", () => {
    const extra = runEgfrCkdEpi({
      serumCreatinineMgDl: 1,
      ageYears: 40,
      sex: "male",
      weightKg: 70,
    });
    if (!extra.ok)
      expect(extra.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "weightKg",
      });
    expect(runEgfrCkdEpi({ ageYears: 40, sex: "male" }).ok).toBe(false);
  });
});
