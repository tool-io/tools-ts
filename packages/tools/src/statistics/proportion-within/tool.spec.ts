import { describe, expect, it } from "vitest";
import { runProportionWithin } from "./tool.js";

describe("Proportion Within Range Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runProportionWithin({
        lower: 10,
        upper: 20,
        values: [5, 10, 15, 20, 25],
      }),
    ).toEqual({ ok: true, output: { proportion: 0.6 } });
  });

  it("returns zero for an empty list", () => {
    expect(runProportionWithin({ lower: 0, upper: 1, values: [] })).toEqual({
      ok: true,
      output: { proportion: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runProportionWithin(null).ok).toBe(false));
});
