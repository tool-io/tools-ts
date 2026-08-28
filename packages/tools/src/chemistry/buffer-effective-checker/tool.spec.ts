import { describe, expect, it } from "vitest";
import { runBufferEffectiveChecker } from "./tool.js";

describe("Buffer Effective Checker", () => {
  it("calculates a valid result", () => {
    expect(runBufferEffectiveChecker({ ph: 4.9, pka: 4.76 })).toEqual({
      ok: true,
      output: { effective: true },
    });
    expect(runBufferEffectiveChecker({ ph: 7, pka: 4.76 })).toEqual({
      ok: true,
      output: { effective: false },
    });
  });

  it("rejects invalid input", () =>
    expect(runBufferEffectiveChecker(null).ok).toBe(false));
});
