import { describe, expect, it } from "vitest";
import { kaprekarCheckerExample, runKaprekarChecker } from "./tool.js";

describe("Kaprekar Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runKaprekarChecker(kaprekarCheckerExample.input)).toEqual({
      ok: true,
      output: kaprekarCheckerExample.output,
    }));
  it("accepts the smallest Kaprekar numbers", () => {
    expect(runKaprekarChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
    expect(runKaprekarChecker({ value: 9 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
  });
  it("accepts known members", () => {
    expect(runKaprekarChecker({ value: 297 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
    expect(runKaprekarChecker({ value: 703 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
    expect(runKaprekarChecker({ value: 2223 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
  });
  it("accepts members whose right part needs zero padding", () => {
    expect(runKaprekarChecker({ value: 99 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
    expect(runKaprekarChecker({ value: 999 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
    expect(runKaprekarChecker({ value: 999999 })).toEqual({
      ok: true,
      output: { isKaprekar: true },
    });
  });
  it("rejects squares whose right split is all zeros", () => {
    expect(runKaprekarChecker({ value: 10 })).toEqual({
      ok: true,
      output: { isKaprekar: false },
    });
    expect(runKaprekarChecker({ value: 100 })).toEqual({
      ok: true,
      output: { isKaprekar: false },
    });
  });
  it("rejects non-members", () => {
    expect(runKaprekarChecker({ value: 2 })).toEqual({
      ok: true,
      output: { isKaprekar: false },
    });
    expect(runKaprekarChecker({ value: 5 })).toEqual({
      ok: true,
      output: { isKaprekar: false },
    });
    expect(runKaprekarChecker({ value: 44 })).toEqual({
      ok: true,
      output: { isKaprekar: false },
    });
  });
  it("accepts the largest supported integer", () =>
    expect(runKaprekarChecker({ value: 94906265 }).ok).toBe(true));
  it("rejects zero and negative integers with a structured error", () => {
    expect(runKaprekarChecker({ value: 0 }).ok).toBe(false);
    expect(runKaprekarChecker({ value: -9 }).ok).toBe(false);
  });
  it("rejects integers beyond the exact-square range", () =>
    expect(runKaprekarChecker({ value: 94906266 }).ok).toBe(false));
  it("rejects malformed input", () => {
    expect(runKaprekarChecker(null).ok).toBe(false);
    expect(runKaprekarChecker({}).ok).toBe(false);
    expect(runKaprekarChecker({ value: 4.5 }).ok).toBe(false);
    expect(runKaprekarChecker({ value: "45" }).ok).toBe(false);
  });
});
