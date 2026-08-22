import { describe, expect, it } from "vitest";
import { runProportionateShare } from "./tool.js";
describe("proportionate share calculator", () => {
  it("computes 3/4 of 200 as 150", () => {
    const r = runProportionateShare({
      ratio: 3,
      sharesTotal: 4,
      totalAmount: 200,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.share).toBe(150);
  });
  it("rejects zero total through execution", () => {
    expect(
      runProportionateShare({ ratio: 1, sharesTotal: 0, totalAmount: 100 }).ok,
    ).toBe(false);
  });
});
