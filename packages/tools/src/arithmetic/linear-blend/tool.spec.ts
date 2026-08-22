import { describe, expect, it } from "vitest";
import { runLinearBlend } from "./tool.js";

describe("Linear Blend Calculator", () => {
  it("calculates a valid result", () => {
    expect(runLinearBlend({ a: 10, b: 30, t: 0.5 })).toEqual({
      ok: true,
      output: { blended: 20 },
    });
    expect(runLinearBlend({ a: 10, b: 30, t: 0 })).toEqual({
      ok: true,
      output: { blended: 10 },
    });
    expect(runLinearBlend({ a: 10, b: 30, t: 1 })).toEqual({
      ok: true,
      output: { blended: 30 },
    });
  });

  it("rejects invalid input", () =>
    expect(runLinearBlend(null).ok).toBe(false));
});
