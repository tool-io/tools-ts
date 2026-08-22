import { describe, expect, it } from "vitest";
import { lucasCheckerExample, runLucasChecker } from "./tool.js";

describe("Lucas Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runLucasChecker(lucasCheckerExample.input)).toEqual({
      ok: true,
      output: lucasCheckerExample.output,
    }));
  it("accepts the smallest members", () => {
    expect(runLucasChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isLucas: true },
    });
    expect(runLucasChecker({ value: 2 })).toEqual({
      ok: true,
      output: { isLucas: true },
    });
    expect(runLucasChecker({ value: 3 })).toEqual({
      ok: true,
      output: { isLucas: true },
    });
    expect(runLucasChecker({ value: 4 })).toEqual({
      ok: true,
      output: { isLucas: true },
    });
  });
  it("rejects zero and known non-members", () => {
    expect(runLucasChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isLucas: false },
    });
    expect(runLucasChecker({ value: 5 })).toEqual({
      ok: true,
      output: { isLucas: false },
    });
    expect(runLucasChecker({ value: 8 })).toEqual({
      ok: true,
      output: { isLucas: false },
    });
  });
  it("accepts larger members", () =>
    expect(runLucasChecker({ value: 199 })).toEqual({
      ok: true,
      output: { isLucas: true },
    }));
  it("accepts the largest Lucas safe integer", () =>
    expect(runLucasChecker({ value: 7639424778862807 })).toEqual({
      ok: true,
      output: { isLucas: true },
    }));
  it("rejects the integer after that member", () =>
    expect(runLucasChecker({ value: 7639424778862808 })).toEqual({
      ok: true,
      output: { isLucas: false },
    }));
  it("rejects negative integers with a structured error", () =>
    expect(runLucasChecker({ value: -7 }).ok).toBe(false));
  it("rejects malformed input", () => {
    expect(runLucasChecker(null).ok).toBe(false);
    expect(runLucasChecker({}).ok).toBe(false);
    expect(runLucasChecker({ value: 3.5 }).ok).toBe(false);
    expect(runLucasChecker({ value: NaN }).ok).toBe(false);
  });
});
