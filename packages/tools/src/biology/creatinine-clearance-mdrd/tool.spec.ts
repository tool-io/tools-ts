import { describe, expect, it } from "vitest";
import {
  creatinineClearanceMdrdExample,
  runCreatinineClearanceMdrd,
} from "./tool.js";

describe("MDRD eGFR", () => {
  it("matches the canonical example", () => {
    expect(
      runCreatinineClearanceMdrd(creatinineClearanceMdrdExample.input),
    ).toEqual({
      ok: true,
      output: creatinineClearanceMdrdExample.output,
    });
  });

  it("applies the female multiplier exactly", () => {
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 1,
        ageYears: 40,
        sex: "female",
      }),
    ).toEqual({ ok: true, output: { egfrMlPerMin: 61.40783352917644 } });
  });

  it("computes another exact value for an adult female", () => {
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 1.2,
        ageYears: 67,
        sex: "female",
      }),
    ).toEqual({ ok: true, output: { egfrMlPerMin: 44.80986247984976 } });
  });

  it("computes another exact value for an adult male", () => {
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 2,
        ageYears: 50,
        sex: "male",
      }),
    ).toEqual({ ok: true, output: { egfrMlPerMin: 35.54336347741413 } });
  });

  it("accepts the youngest eligible adult", () => {
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 1,
        ageYears: 18,
        sex: "female",
      }),
    ).toEqual({ ok: true, output: { egfrMlPerMin: 72.21403887549187 } });
  });

  it("rejects zero serum creatinine through the schema", () => {
    const result = runCreatinineClearanceMdrd({
      serumCreatinineMgDl: 0,
      ageYears: 40,
      sex: "male",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "serumCreatinineMgDl",
      });
  });

  it("rejects out of range and fractional ages through the schema", () => {
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 1,
        ageYears: 17,
        sex: "male",
      }).ok,
    ).toBe(false);
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 1,
        ageYears: 121,
        sex: "male",
      }).ok,
    ).toBe(false);
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 1,
        ageYears: 39.5,
        sex: "male",
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown sex values and unknown fields", () => {
    expect(
      runCreatinineClearanceMdrd({
        serumCreatinineMgDl: 1,
        ageYears: 40,
        sex: "unknown" as never,
      }).ok,
    ).toBe(false);
    const result = runCreatinineClearanceMdrd({
      serumCreatinineMgDl: 1,
      ageYears: 40,
      sex: "male",
      extra: 1,
    });
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
});
