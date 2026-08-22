import { describe, expect, it } from "vitest";
import { mersenneCheckerExample, runMersenneChecker } from "./tool.js";

describe("Mersenne Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runMersenneChecker(mersenneCheckerExample.input)).toEqual({
      ok: true,
      output: mersenneCheckerExample.output,
    }));
  it("accepts the smallest members", () => {
    expect(runMersenneChecker({ value: 3 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
    expect(runMersenneChecker({ value: 7 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
  });
  it("accepts known members", () => {
    expect(runMersenneChecker({ value: 127 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
    expect(runMersenneChecker({ value: 8191 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
  });
  it("accepts a composite Mersenne value", () =>
    expect(runMersenneChecker({ value: 2047 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    }));
  it("accepts powers of two minus one with composite exponents", () => {
    expect(runMersenneChecker({ value: 15 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
    expect(runMersenneChecker({ value: 255 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
    expect(runMersenneChecker({ value: 4503599627370495 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
  });
  it("distinguishes values by whether their successor is a power of two", () => {
    expect(runMersenneChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isMersenne: false },
    });
    expect(runMersenneChecker({ value: 5 })).toEqual({
      ok: true,
      output: { isMersenne: false },
    });
    expect(runMersenneChecker({ value: 63 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    });
  });
  it("accepts the largest Mersenne safe integer with prime exponent", () =>
    expect(runMersenneChecker({ value: 140737488355327 })).toEqual({
      ok: true,
      output: { isMersenne: true },
    }));
  it("rejects negative integers with a structured error", () =>
    expect(runMersenneChecker({ value: -1 }).ok).toBe(false));
  it("rejects malformed input", () => {
    expect(runMersenneChecker(null).ok).toBe(false);
    expect(runMersenneChecker({}).ok).toBe(false);
    expect(runMersenneChecker({ value: 3.5 }).ok).toBe(false);
    expect(runMersenneChecker({ value: "31" }).ok).toBe(false);
  });
});
