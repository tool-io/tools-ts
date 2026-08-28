import { describe, expect, it } from "vitest";
import { runEntropyChange } from "./tool.js";

describe("Entropy Change Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runEntropyChange({
        productStandardEntropies: [213.8, 188.8],
        reactantStandardEntropies: [186.3, 205.2],
      }),
    ).toEqual({
      ok: true,
      output: { entropyChangeJPerMolK: expect.closeTo(11.1, 6) },
    });
  });

  it("rejects invalid input", () =>
    expect(runEntropyChange(null).ok).toBe(false));
});
