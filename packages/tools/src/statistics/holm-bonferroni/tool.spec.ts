import { describe, expect, it } from "vitest";
import { calculateHolmBonferroni } from "./tool.js";

describe("Holm-Bonferroni", () => {
  it("adjusts values stepwise and restores input order", () => {
    expect(calculateHolmBonferroni({ pValues: [0.01, 0.04, 0.03] })).toEqual({
      ok: true,
      output: { adjustedPValues: [0.03, 0.06, 0.06] },
    });
  });

  it("rejects values outside the probability range", () => {
    expect(calculateHolmBonferroni({ pValues: [0.1, 1.1] })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });
});
