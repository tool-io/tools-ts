import { describe, expect, it } from "vitest";
import { runBonePercentage } from "./tool.js";

describe("Bone Percentage", () => {
  it("yields six point two five percent at bone twenty of carcass three hundred twenty", () =>
    expect(runBonePercentage({ boneMassKg: 20, carcassWeightKg: 320 })).toEqual(
      { ok: true, output: { bonePercentage: 6.25 } },
    ));
  it("yields ten percent at bone thirty of carcass three hundred", () =>
    expect(runBonePercentage({ boneMassKg: 30, carcassWeightKg: 300 })).toEqual(
      {
        ok: true,
        output: { bonePercentage: 10 },
      },
    ));
  it("caps at one hundred percent when bone equals carcass weight", () =>
    expect(
      runBonePercentage({ boneMassKg: 300, carcassWeightKg: 300 }),
    ).toEqual({ ok: true, output: { bonePercentage: 100 } }));
  it("rejects zero carcass weight", () =>
    expect(runBonePercentage({ boneMassKg: 20, carcassWeightKg: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative carcass weight", () =>
    expect(
      runBonePercentage({ boneMassKg: 20, carcassWeightKg: -320 }).ok,
    ).toBe(false));
  it("rejects negative bone mass", () =>
    expect(runBonePercentage({ boneMassKg: -1, carcassWeightKg: 320 }).ok).toBe(
      false,
    ));
  it("rejects bone heavier than the carcass", () =>
    expect(
      runBonePercentage({ boneMassKg: 350, carcassWeightKg: 300 }).ok,
    ).toBe(false));
});
