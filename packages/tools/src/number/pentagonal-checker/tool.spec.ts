import { describe, expect, it } from "vitest";
import { pentagonalCheckerExample, runPentagonalChecker } from "./tool.js";

describe("Pentagonal Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runPentagonalChecker(pentagonalCheckerExample.input)).toEqual({
      ok: true,
      output: pentagonalCheckerExample.output,
    }));
  it("accepts small members", () => {
    expect(runPentagonalChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isPentagonal: true },
    });
    expect(runPentagonalChecker({ value: 5 })).toEqual({
      ok: true,
      output: { isPentagonal: true },
    });
    expect(runPentagonalChecker({ value: 92 })).toEqual({
      ok: true,
      output: { isPentagonal: true },
    });
  });
  it("rejects zero and known non-members", () => {
    expect(runPentagonalChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isPentagonal: false },
    });
    expect(runPentagonalChecker({ value: 2 })).toEqual({
      ok: true,
      output: { isPentagonal: false },
    });
    expect(runPentagonalChecker({ value: 8 })).toEqual({
      ok: true,
      output: { isPentagonal: false },
    });
  });
  it("accepts a large member with k = 10000000", () =>
    expect(runPentagonalChecker({ value: 149999995000000 })).toEqual({
      ok: true,
      output: { isPentagonal: true },
    }));
  it("rejects a large near-member", () =>
    expect(runPentagonalChecker({ value: 149999995000001 })).toEqual({
      ok: true,
      output: { isPentagonal: false },
    }));
  it("rejects negative integers and fractions with structured errors", () => {
    expect(runPentagonalChecker({ value: -3 }).ok).toBe(false);
    expect(runPentagonalChecker({ value: 5.5 }).ok).toBe(false);
  });
  it("rejects malformed input", () => {
    expect(runPentagonalChecker(null).ok).toBe(false);
    expect(runPentagonalChecker({}).ok).toBe(false);
    expect(runPentagonalChecker({ value: Infinity }).ok).toBe(false);
  });
});
