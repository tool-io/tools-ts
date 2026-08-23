import { describe, expect, it } from "vitest";
import { runEvilChecker } from "./tool.js";

describe("Evil Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runEvilChecker({ value: 3 })).toEqual({
      ok: true,
      output: { isEvil: true },
    }));

  it("accepts zero with no one bits", () =>
    expect(runEvilChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isEvil: true },
    }));

  it("accepts five with two one bits", () =>
    expect(runEvilChecker({ value: 5 })).toEqual({
      ok: true,
      output: { isEvil: true },
    }));

  it("accepts nine with two one bits", () =>
    expect(runEvilChecker({ value: 9 })).toEqual({
      ok: true,
      output: { isEvil: true },
    }));

  it("rejects one with a single one bit", () =>
    expect(runEvilChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isEvil: false },
    }));

  it("rejects two", () =>
    expect(runEvilChecker({ value: 2 })).toEqual({
      ok: true,
      output: { isEvil: false },
    }));

  it("rejects forty two with three one bits", () =>
    expect(runEvilChecker({ value: 42 })).toEqual({
      ok: true,
      output: { isEvil: false },
    }));

  it("rejects negative integers", () =>
    expect(runEvilChecker({ value: -1 }).ok).toBe(false));

  it("rejects non-integers", () =>
    expect(runEvilChecker({ value: 3.5 }).ok).toBe(false));
});
