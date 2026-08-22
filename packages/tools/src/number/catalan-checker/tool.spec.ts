import { describe, expect, it } from "vitest";
import { catalanCheckerExample, runCatalanChecker } from "./tool.js";

describe("Catalan Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runCatalanChecker(catalanCheckerExample.input)).toEqual({
      ok: true,
      output: catalanCheckerExample.output,
    }));
  it("accepts the smallest members", () => {
    expect(runCatalanChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isCatalan: true },
    });
    expect(runCatalanChecker({ value: 2 })).toEqual({
      ok: true,
      output: { isCatalan: true },
    });
    expect(runCatalanChecker({ value: 5 })).toEqual({
      ok: true,
      output: { isCatalan: true },
    });
  });
  it("accepts known members", () => {
    expect(runCatalanChecker({ value: 14 })).toEqual({
      ok: true,
      output: { isCatalan: true },
    });
    expect(runCatalanChecker({ value: 4862 })).toEqual({
      ok: true,
      output: { isCatalan: true },
    });
  });
  it("accepts the largest Catalan safe integer", () =>
    expect(runCatalanChecker({ value: 3814986502092304 })).toEqual({
      ok: true,
      output: { isCatalan: true },
    }));
  it("rejects known non-members", () => {
    expect(runCatalanChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isCatalan: false },
    });
    expect(runCatalanChecker({ value: 4 })).toEqual({
      ok: true,
      output: { isCatalan: false },
    });
    expect(runCatalanChecker({ value: 41 })).toEqual({
      ok: true,
      output: { isCatalan: false },
    });
  });
  it("rejects the largest safe non-member above the last Catalan", () =>
    expect(runCatalanChecker({ value: 3814986502092305 })).toEqual({
      ok: true,
      output: { isCatalan: false },
    }));
  it("rejects the maximum safe integer", () =>
    expect(runCatalanChecker({ value: Number.MAX_SAFE_INTEGER })).toEqual({
      ok: true,
      output: { isCatalan: false },
    }));
  it("rejects negative integers with a structured error", () =>
    expect(runCatalanChecker({ value: -1 }).ok).toBe(false));
  it("rejects malformed input", () => {
    expect(runCatalanChecker(null).ok).toBe(false);
    expect(runCatalanChecker({}).ok).toBe(false);
    expect(runCatalanChecker({ value: 4.5 }).ok).toBe(false);
    expect(runCatalanChecker({ value: "42" }).ok).toBe(false);
  });
});
