import { describe, expect, it } from "vitest";
import { fibonacciCheckerExample, runFibonacciChecker } from "./tool.js";

describe("Fibonacci Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runFibonacciChecker(fibonacciCheckerExample.input)).toEqual({
      ok: true,
      output: fibonacciCheckerExample.output,
    }));
  it("accepts the smallest members", () => {
    expect(runFibonacciChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isFibonacci: true },
    });
    expect(runFibonacciChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isFibonacci: true },
    });
    expect(runFibonacciChecker({ value: 2 })).toEqual({
      ok: true,
      output: { isFibonacci: true },
    });
  });
  it("accepts known members", () =>
    expect(runFibonacciChecker({ value: 13 })).toEqual({
      ok: true,
      output: { isFibonacci: true },
    }));
  it("rejects known non-members", () => {
    expect(runFibonacciChecker({ value: 4 })).toEqual({
      ok: true,
      output: { isFibonacci: false },
    });
    expect(runFibonacciChecker({ value: 22 })).toEqual({
      ok: true,
      output: { isFibonacci: false },
    });
  });
  it("accepts the largest Fibonacci safe integer", () =>
    expect(runFibonacciChecker({ value: 8944394323791464 })).toEqual({
      ok: true,
      output: { isFibonacci: true },
    }));
  it("rejects the integer after that member", () =>
    expect(runFibonacciChecker({ value: 8944394323791465 })).toEqual({
      ok: true,
      output: { isFibonacci: false },
    }));
  it("rejects negative integers with a structured error", () =>
    expect(runFibonacciChecker({ value: -1 }).ok).toBe(false));
  it("rejects malformed input", () => {
    expect(runFibonacciChecker(null).ok).toBe(false);
    expect(runFibonacciChecker({}).ok).toBe(false);
    expect(runFibonacciChecker({ value: 2.5 }).ok).toBe(false);
    expect(runFibonacciChecker({ value: "21" }).ok).toBe(false);
  });
});
