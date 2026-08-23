import { describe, expect, it } from "vitest";
import { runHappyChecker } from "./tool.js";

describe("Happy Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runHappyChecker({ value: 19 })).toEqual({
      ok: true,
      output: { isHappy: true },
    }));

  it("accepts one immediately", () =>
    expect(runHappyChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isHappy: true },
    }));

  it("accepts seven after several iterations", () =>
    expect(runHappyChecker({ value: 7 })).toEqual({
      ok: true,
      output: { isHappy: true },
    }));

  it("accepts one hundred", () =>
    expect(runHappyChecker({ value: 100 })).toEqual({
      ok: true,
      output: { isHappy: true },
    }));

  it("rejects two in the unhappy cycle", () =>
    expect(runHappyChecker({ value: 2 })).toEqual({
      ok: true,
      output: { isHappy: false },
    }));

  it("rejects four", () =>
    expect(runHappyChecker({ value: 4 })).toEqual({
      ok: true,
      output: { isHappy: false },
    }));

  it("rejects one hundred sixteen in the eight cycle", () =>
    expect(runHappyChecker({ value: 116 })).toEqual({
      ok: true,
      output: { isHappy: false },
    }));

  it("rejects values below one", () =>
    expect(runHappyChecker({ value: 0 }).ok).toBe(false));

  it("rejects non-integers", () =>
    expect(runHappyChecker({ value: 2.5 }).ok).toBe(false));
});
