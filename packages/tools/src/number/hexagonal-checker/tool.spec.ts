import { describe, expect, it } from "vitest";
import { runHexagonalChecker } from "./tool.js";

describe("Hexagonal Number Checker", () => {
  it("calculates the canonical example", () =>
    expect(runHexagonalChecker({ value: 15 })).toEqual({
      ok: true,
      output: { isHexagonal: true },
    }));

  it("accepts the first hexagonal number", () =>
    expect(runHexagonalChecker({ value: 1 })).toEqual({
      ok: true,
      output: { isHexagonal: true },
    }));

  it("accepts six", () =>
    expect(runHexagonalChecker({ value: 6 })).toEqual({
      ok: true,
      output: { isHexagonal: true },
    }));

  it("accepts forty five", () =>
    expect(runHexagonalChecker({ value: 45 })).toEqual({
      ok: true,
      output: { isHexagonal: true },
    }));

  it("rejects zero", () =>
    expect(runHexagonalChecker({ value: 0 })).toEqual({
      ok: true,
      output: { isHexagonal: false },
    }));

  it("rejects a nearby triangular number", () =>
    expect(runHexagonalChecker({ value: 21 })).toEqual({
      ok: true,
      output: { isHexagonal: false },
    }));

  it("rejects negative integers", () =>
    expect(runHexagonalChecker({ value: -1 }).ok).toBe(false));

  it("rejects non-integers", () =>
    expect(runHexagonalChecker({ value: 1.5 }).ok).toBe(false));
});
