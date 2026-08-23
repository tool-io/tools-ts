import { describe, expect, it } from "vitest";
import { runBetrothedChecker } from "./tool.js";

describe("Betrothed Numbers Checker", () => {
  it("calculates the canonical example", () =>
    expect(runBetrothedChecker({ a: 48, b: 75 })).toEqual({
      ok: true,
      output: { isBetrothedPair: true },
    }));

  it("is order independent", () =>
    expect(runBetrothedChecker({ a: 75, b: 48 })).toEqual({
      ok: true,
      output: { isBetrothedPair: true },
    }));

  it("accepts another classic pair", () =>
    expect(runBetrothedChecker({ a: 140, b: 195 })).toEqual({
      ok: true,
      output: { isBetrothedPair: true },
    }));

  it("rejects an amicable pair", () =>
    expect(runBetrothedChecker({ a: 220, b: 284 })).toEqual({
      ok: true,
      output: { isBetrothedPair: false },
    }));

  it("rejects an off by one partner", () =>
    expect(runBetrothedChecker({ a: 48, b: 76 })).toEqual({
      ok: true,
      output: { isBetrothedPair: false },
    }));

  it("rejects equal integers", () =>
    expect(runBetrothedChecker({ a: 48, b: 48 })).toEqual({
      ok: true,
      output: { isBetrothedPair: false },
    }));

  it("rejects integers below two", () =>
    expect(runBetrothedChecker({ a: 0, b: 1 }).ok).toBe(false));

  it("rejects non-integers", () =>
    expect(runBetrothedChecker({ a: 3.5, b: 5 }).ok).toBe(false));
});
