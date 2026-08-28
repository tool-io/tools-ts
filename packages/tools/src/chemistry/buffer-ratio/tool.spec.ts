import { describe, expect, it } from "vitest";
import { runBufferRatio } from "./tool.js";

describe("Buffer Ratio Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBufferRatio({ ph: 7.4, pka: 7.21 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ratio).toBeCloseTo(1.5488, 3);
  });

  it("returns one when pH equals pKa", () => {
    expect(runBufferRatio({ ph: 4.76, pka: 4.76 })).toEqual({
      ok: true,
      output: { ratio: 1 },
    });
  });

  it("rejects invalid input", () =>
    expect(runBufferRatio(null).ok).toBe(false));
});
