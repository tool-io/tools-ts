import { describe, expect, it } from "vitest";
import { runCarcassYieldPercentage } from "./tool.js";

describe("Carcass Yield %", () => {
  it("yields fifty percent at carcass three hundred over live six hundred", () =>
    expect(
      runCarcassYieldPercentage({ carcassWeightKg: 300, liveWeightKg: 600 }),
    ).toEqual({
      ok: true,
      output: { dressingYieldPercent: 50 },
    }));
  it("yields fifty percent at carcass three hundred fifty over live seven hundred", () =>
    expect(
      runCarcassYieldPercentage({ carcassWeightKg: 350, liveWeightKg: 700 }),
    ).toEqual({
      ok: true,
      output: { dressingYieldPercent: 50 },
    }));
  it("caps at one hundred percent when carcass equals live weight", () =>
    expect(
      runCarcassYieldPercentage({ carcassWeightKg: 600, liveWeightKg: 600 }),
    ).toEqual({
      ok: true,
      output: { dressingYieldPercent: 100 },
    }));
  it("rejects zero live weight", () =>
    expect(
      runCarcassYieldPercentage({ carcassWeightKg: 300, liveWeightKg: 0 }).ok,
    ).toBe(false));
  it("rejects negative live weight", () =>
    expect(
      runCarcassYieldPercentage({ carcassWeightKg: 300, liveWeightKg: -600 })
        .ok,
    ).toBe(false));
  it("rejects negative carcass weight", () =>
    expect(
      runCarcassYieldPercentage({ carcassWeightKg: -1, liveWeightKg: 600 }).ok,
    ).toBe(false));
  it("rejects carcass heavier than live weight", () =>
    expect(
      runCarcassYieldPercentage({ carcassWeightKg: 700, liveWeightKg: 600 }).ok,
    ).toBe(false));
});
