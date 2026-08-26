import { describe, expect, it } from "vitest";
import { runMeatToBoneRatio } from "./tool.js";

describe("Meat To Bone Ratio", () => {
  it("ratios lean meat two hundred forty over bone twenty to twelve", () =>
    expect(runMeatToBoneRatio({ boneMassKg: 20, leanMeatMassKg: 240 })).toEqual(
      { ok: true, output: { meatToBoneRatio: 12 } },
    ));
  it("ratios lean meat one hundred eighty over bone thirty to six", () =>
    expect(runMeatToBoneRatio({ boneMassKg: 30, leanMeatMassKg: 180 })).toEqual(
      {
        ok: true,
        output: { meatToBoneRatio: 6 },
      },
    ));
  it("supports fractional ratios", () =>
    expect(runMeatToBoneRatio({ boneMassKg: 40, leanMeatMassKg: 250 })).toEqual(
      { ok: true, output: { meatToBoneRatio: 6.25 } },
    ));
  it("rejects zero bone mass", () =>
    expect(runMeatToBoneRatio({ boneMassKg: 0, leanMeatMassKg: 240 }).ok).toBe(
      false,
    ));
  it("rejects negative bone mass", () =>
    expect(runMeatToBoneRatio({ boneMassKg: -5, leanMeatMassKg: 240 }).ok).toBe(
      false,
    ));
  it("accepts zero lean meat mass", () =>
    expect(runMeatToBoneRatio({ boneMassKg: 20, leanMeatMassKg: 0 })).toEqual({
      ok: true,
      output: { meatToBoneRatio: 0 },
    }));
  it("rejects negative lean meat mass", () =>
    expect(runMeatToBoneRatio({ boneMassKg: 20, leanMeatMassKg: -1 }).ok).toBe(
      false,
    ));
});
