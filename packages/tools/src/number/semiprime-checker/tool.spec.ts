import { describe, expect, it } from "vitest";
import { runSemiprimeChecker } from "./tool.js";

describe("Semiprime Checker", () => {
  it("calculates a valid result", () => {
    expect(runSemiprimeChecker({ value: 15 })).toEqual({
      ok: true,
      output: { semiprime: true },
    });
    expect(runSemiprimeChecker({ value: 9 })).toEqual({
      ok: true,
      output: { semiprime: true },
    });
    expect(runSemiprimeChecker({ value: 30 })).toEqual({
      ok: true,
      output: { semiprime: false },
    });
  });

  it("rejects invalid input", () =>
    expect(runSemiprimeChecker(null).ok).toBe(false));
});
