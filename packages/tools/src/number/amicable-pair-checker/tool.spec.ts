import { describe, expect, it } from "vitest";
import { runAmicablePairChecker } from "./tool.js";

describe("Amicable Pair Checker", () => {
  it("calculates the canonical example", () =>
    expect(runAmicablePairChecker({ a: 220, b: 284 })).toEqual({
      ok: true,
      output: { isAmicablePair: true },
    }));

  it("is order independent", () =>
    expect(runAmicablePairChecker({ a: 284, b: 220 })).toEqual({
      ok: true,
      output: { isAmicablePair: true },
    }));

  it("accepts another classic pair", () =>
    expect(runAmicablePairChecker({ a: 1184, b: 1210 })).toEqual({
      ok: true,
      output: { isAmicablePair: true },
    }));

  it("rejects an equal perfect pair", () =>
    expect(runAmicablePairChecker({ a: 6, b: 6 })).toEqual({
      ok: true,
      output: { isAmicablePair: false },
    }));

  it("rejects a near miss", () =>
    expect(runAmicablePairChecker({ a: 220, b: 285 })).toEqual({
      ok: true,
      output: { isAmicablePair: false },
    }));

  it("rejects small distinct integers", () =>
    expect(runAmicablePairChecker({ a: 2, b: 3 })).toEqual({
      ok: true,
      output: { isAmicablePair: false },
    }));

  it("rejects integers below two", () =>
    expect(runAmicablePairChecker({ a: 1, b: 2 }).ok).toBe(false));

  it("rejects non-integers", () =>
    expect(runAmicablePairChecker({ a: 2.5, b: 4 }).ok).toBe(false));
});
