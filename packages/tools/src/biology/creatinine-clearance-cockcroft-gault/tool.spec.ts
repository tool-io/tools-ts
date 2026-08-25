import { describe, expect, it } from "vitest";
import { creatinineClearanceExample, runCreatinineClearance } from "./tool.js";

describe("Cockcroft-Gault CrCl", () => {
  it("publishes an executable example", () =>
    expect(runCreatinineClearance(creatinineClearanceExample.input)).toEqual({
      ok: true,
      output: creatinineClearanceExample.output,
    }));
  it("applies the female factor of 0.85", () =>
    expect(
      runCreatinineClearance({
        ageYears: 40,
        sex: "female",
        serumCreatinineMgDl: 1,
        weightKg: 70,
      }),
    ).toEqual({
      ok: true,
      output: { creatinineClearanceMlMin: 82.63888888888889 },
    }));
  it("computes another male result", () =>
    expect(
      runCreatinineClearance({
        ageYears: 70,
        sex: "male",
        serumCreatinineMgDl: 1.2,
        weightKg: 60,
      }),
    ).toEqual({
      ok: true,
      output: { creatinineClearanceMlMin: 48.611111111111114 },
    }));
  it("rejects an out-of-range age", () => {
    const result = runCreatinineClearance({
      ageYears: 121,
      sex: "male",
      serumCreatinineMgDl: 1,
      weightKg: 70,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects pediatric ages", () =>
    expect(
      runCreatinineClearance({
        ageYears: 17,
        sex: "male",
        serumCreatinineMgDl: 1,
        weightKg: 70,
      }).ok,
    ).toBe(false));
  it("rejects a non-integer age", () => {
    const result = runCreatinineClearance({
      ageYears: 40.5,
      sex: "male",
      serumCreatinineMgDl: 1,
      weightKg: 70,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects zero serum creatinine", () => {
    const result = runCreatinineClearance({
      ageYears: 40,
      sex: "male",
      serumCreatinineMgDl: 0,
      weightKg: 70,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects an unsupported sex", () => {
    const result = runCreatinineClearance({
      ageYears: 40,
      sex: "other",
      serumCreatinineMgDl: 1,
      weightKg: 70,
    });
    expect(result.ok).toBe(false);
  });
});
