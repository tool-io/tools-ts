import { describe, expect, it } from "vitest";
import { runRunwayWindTotal } from "./tool.js";
describe("Total Wind Component Calculator", () => {
  it("calculates a valid result", () =>
    expect(runRunwayWindTotal({ crosswindKt: 40, headwindKt: 30 })).toEqual({
      ok: true,
      output: { totalComponentKt: 50 },
    }));
  it("returns zero for calm winds", () =>
    expect(runRunwayWindTotal({ crosswindKt: 0, headwindKt: 0 })).toEqual({
      ok: true,
      output: { totalComponentKt: 0 },
    }));
  it("ignores signs of the components", () =>
    expect(runRunwayWindTotal({ crosswindKt: -40, headwindKt: -30 })).toEqual({
      ok: true,
      output: { totalComponentKt: 50 },
    }));
  it("handles a pure crosswind", () =>
    expect(runRunwayWindTotal({ crosswindKt: 25, headwindKt: 0 })).toEqual({
      ok: true,
      output: { totalComponentKt: 25 },
    }));
  it("handles fractional components", () =>
    expect(runRunwayWindTotal({ crosswindKt: 2, headwindKt: 1.5 })).toEqual({
      ok: true,
      output: { totalComponentKt: 2.5 },
    }));
  it("rejects non-finite components", () => {
    expect(
      runRunwayWindTotal({
        crosswindKt: Number.NaN,
        headwindKt: 30,
      }).ok,
    ).toBe(false);
    expect(
      runRunwayWindTotal({
        crosswindKt: 40,
        headwindKt: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });
});
