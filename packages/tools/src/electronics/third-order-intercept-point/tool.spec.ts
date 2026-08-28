import { describe, expect, it } from "vitest";
import { runThirdOrderInterceptPoint } from "./tool.js";

describe("IP3 From Two Tones", () => {
  it("calculates a valid result", () =>
    expect(runThirdOrderInterceptPoint({ plOneDbm: 10, im3Dbm: -30 })).toEqual({
      ok: true,
      output: { ip3Dbm: 30 },
    }));
  it("handles an IM3 product above the tone", () =>
    expect(runThirdOrderInterceptPoint({ plOneDbm: 0, im3Dbm: 10 })).toEqual({
      ok: true,
      output: { ip3Dbm: -5 },
    }));
  it("supports fractional results", () =>
    expect(runThirdOrderInterceptPoint({ plOneDbm: 6, im3Dbm: -18 })).toEqual({
      ok: true,
      output: { ip3Dbm: 18 },
    }));
  it("handles high-power amplifiers", () =>
    expect(runThirdOrderInterceptPoint({ plOneDbm: 20, im3Dbm: -28 })).toEqual({
      ok: true,
      output: { ip3Dbm: 44 },
    }));
  it("rejects a non-finite tone power", () =>
    expect(
      runThirdOrderInterceptPoint({
        plOneDbm: Number.POSITIVE_INFINITY,
        im3Dbm: -30,
      }).ok,
    ).toBe(false));
  it("rejects a non-finite IM3 product", () =>
    expect(
      runThirdOrderInterceptPoint({ plOneDbm: 10, im3Dbm: Number.NaN }).ok,
    ).toBe(false));
});
