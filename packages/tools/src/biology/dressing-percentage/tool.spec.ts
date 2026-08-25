import { describe, expect, it } from "vitest";
import { runDressingPercentage } from "./tool.js";

describe("Dressing Percentage", () => {
  it("yields fifty percent at hot carcass three hundred forty over shrunk live six hundred eighty", () =>
    expect(
      runDressingPercentage({ hotCarcassKg: 340, shrunkLiveWeightKg: 680 }),
    ).toEqual({
      ok: true,
      output: { dressingPercentage: 50 },
    }));
  it("yields fifty percent at hot carcass two hundred fifty over shrunk live five hundred", () =>
    expect(
      runDressingPercentage({ hotCarcassKg: 250, shrunkLiveWeightKg: 500 }),
    ).toEqual({
      ok: true,
      output: { dressingPercentage: 50 },
    }));
  it("caps at one hundred percent when carcass equals shrunk live weight", () =>
    expect(
      runDressingPercentage({ hotCarcassKg: 680, shrunkLiveWeightKg: 680 }),
    ).toEqual({
      ok: true,
      output: { dressingPercentage: 100 },
    }));
  it("rejects zero shrunk live weight", () =>
    expect(
      runDressingPercentage({ hotCarcassKg: 340, shrunkLiveWeightKg: 0 }).ok,
    ).toBe(false));
  it("rejects negative shrunk live weight", () =>
    expect(
      runDressingPercentage({ hotCarcassKg: 340, shrunkLiveWeightKg: -680 }).ok,
    ).toBe(false));
  it("rejects hot carcass heavier than shrunk live weight", () =>
    expect(
      runDressingPercentage({ hotCarcassKg: 700, shrunkLiveWeightKg: 680 }).ok,
    ).toBe(false));
});
