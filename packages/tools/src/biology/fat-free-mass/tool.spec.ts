import { describe, expect, it } from "vitest";
import { runFatFreeMass } from "./tool.js";

describe("Fat Free Mass", () => {
  it("yields sixty-four kilograms at eighty kilograms and twenty percent fat", () =>
    expect(runFatFreeMass({ bodyFatPercent: 20, bodyWeightKg: 80 })).toEqual({
      ok: true,
      output: { fatFreeMassKg: 64 },
    }));
  it("returns full body weight at zero percent fat", () =>
    expect(runFatFreeMass({ bodyFatPercent: 0, bodyWeightKg: 60 })).toEqual({
      ok: true,
      output: { fatFreeMassKg: 60 },
    }));
  it("accepts the sixty percent fat boundary", () =>
    expect(runFatFreeMass({ bodyFatPercent: 60, bodyWeightKg: 100 })).toEqual({
      ok: true,
      output: { fatFreeMassKg: 40 },
    }));
  it("halves body weight at fifty percent fat", () =>
    expect(runFatFreeMass({ bodyFatPercent: 50, bodyWeightKg: 70 })).toEqual({
      ok: true,
      output: { fatFreeMassKg: 35 },
    }));
  it("rejects zero body weight", () =>
    expect(runFatFreeMass({ bodyFatPercent: 20, bodyWeightKg: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative body weight", () =>
    expect(runFatFreeMass({ bodyFatPercent: 20, bodyWeightKg: -80 }).ok).toBe(
      false,
    ));
  it("rejects body fat above one hundred percent", () =>
    expect(runFatFreeMass({ bodyFatPercent: 101, bodyWeightKg: 80 }).ok).toBe(
      false,
    ));
});
