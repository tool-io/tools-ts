import { describe, expect, it } from "vitest";
import { runPooledVariance } from "./tool.js";
describe("Pooled Variance Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runPooledVariance({
        firstVariance: 4,
        firstSize: 5,
        secondVariance: 9,
        secondSize: 5,
      }),
    ).toEqual({ ok: true, output: { pooledVariance: 6.5 } });
  });
  it("rejects invalid input", () =>
    expect(runPooledVariance(null).ok).toBe(false));
});
