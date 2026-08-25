import { describe, expect, it } from "vitest";
import { runFatPercentageCarcass } from "./tool.js";

describe("Carcass Fat %", () => {
  it("yields twenty percent at fat sixty of carcass three hundred", () =>
    expect(
      runFatPercentageCarcass({ carcassWeightKg: 300, fatMassKg: 60 }),
    ).toEqual({ ok: true, output: { fatPercentage: 20 } }));
  it("yields fifteen percent at fat forty-five of carcass three hundred", () =>
    expect(
      runFatPercentageCarcass({ carcassWeightKg: 300, fatMassKg: 45 }),
    ).toEqual({ ok: true, output: { fatPercentage: 15 } }));
  it("caps at one hundred percent when fat equals carcass weight", () =>
    expect(
      runFatPercentageCarcass({ carcassWeightKg: 300, fatMassKg: 300 }),
    ).toEqual({ ok: true, output: { fatPercentage: 100 } }));
  it("rejects zero carcass weight", () =>
    expect(
      runFatPercentageCarcass({ carcassWeightKg: 0, fatMassKg: 60 }).ok,
    ).toBe(false));
  it("rejects negative carcass weight", () =>
    expect(
      runFatPercentageCarcass({ carcassWeightKg: -300, fatMassKg: 60 }).ok,
    ).toBe(false));
  it("rejects fat heavier than the carcass", () =>
    expect(
      runFatPercentageCarcass({ carcassWeightKg: 300, fatMassKg: 310 }).ok,
    ).toBe(false));
});
