import { describe, expect, it } from "vitest";
import { runSmithChecker } from "./tool.js";

describe("Smith Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runSmithChecker({ value: 22 })).toEqual({
      ok: true,
      output: { isSmith: true },
    }));

  it("accepts the smallest Smith number four", () =>
    expect(runSmithChecker({ value: 4 })).toEqual({
      ok: true,
      output: { isSmith: true },
    }));

  it("accepts twenty seven with repeated factors", () =>
    expect(runSmithChecker({ value: 27 })).toEqual({
      ok: true,
      output: { isSmith: true },
    }));

  it("rejects primes", () =>
    expect(runSmithChecker({ value: 13 })).toEqual({
      ok: true,
      output: { isSmith: false },
    }));

  it("rejects composites whose digit sums differ", () =>
    expect(runSmithChecker({ value: 18 })).toEqual({
      ok: true,
      output: { isSmith: false },
    }));

  it("rejects values below four", () =>
    expect(runSmithChecker({ value: 3 })).toEqual({
      ok: true,
      output: { isSmith: false },
    }));

  it("rejects zero", () =>
    expect(runSmithChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isSmith: false },
    }));

  it("rejects negative integers", () =>
    expect(runSmithChecker({ value: -7 }).ok).toBe(false));

  it("rejects non-integers", () =>
    expect(runSmithChecker({ value: 4.5 }).ok).toBe(false));
});
