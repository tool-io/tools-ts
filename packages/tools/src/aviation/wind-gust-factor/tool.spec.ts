import { describe, expect, it } from "vitest";
import { runWindGustFactor } from "./tool.js";
describe("Wind Gust Factor Calculator", () => {
  it("defaults to half the spread", () =>
    expect(runWindGustFactor({ gustSpreadKt: 20 })).toEqual({
      ok: true,
      output: { gustFactorKt: 10 },
    }));
  it("applies an explicit percentage", () =>
    expect(
      runWindGustFactor({ gustFactorPercent: 100, gustSpreadKt: 15 }),
    ).toEqual({ ok: true, output: { gustFactorKt: 15 } }));
  it("allows a zero percentage", () =>
    expect(
      runWindGustFactor({ gustFactorPercent: 0, gustSpreadKt: 15 }),
    ).toEqual({ ok: true, output: { gustFactorKt: 0 } }));
  it("allows a zero spread", () =>
    expect(runWindGustFactor({ gustSpreadKt: 0 })).toEqual({
      ok: true,
      output: { gustFactorKt: 0 },
    }));
  it("handles fractional spreads", () =>
    expect(
      runWindGustFactor({ gustFactorPercent: 40, gustSpreadKt: 12.5 }),
    ).toEqual({ ok: true, output: { gustFactorKt: 5 } }));
  it("rejects negative spreads", () =>
    expect(runWindGustFactor({ gustSpreadKt: -1 }).ok).toBe(false));
  it("rejects percentages above the bound", () =>
    expect(
      runWindGustFactor({ gustFactorPercent: 101, gustSpreadKt: 10 }).ok,
    ).toBe(false));
  it("rejects negative percentages", () =>
    expect(
      runWindGustFactor({ gustFactorPercent: -1, gustSpreadKt: 10 }).ok,
    ).toBe(false));
});
