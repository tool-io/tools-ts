import { describe, expect, it } from "vitest";
import { runBondLengthFromOrder } from "./tool.js";

describe("Bond Length From Order Calculator", () => {
  it("shortens bond as order increases", () => {
    const result = runBondLengthFromOrder({
      bondOrder: 2,
      singleBondLengthPm: 154,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.bondLengthPm).toBeLessThan(154);
  });
  it("rejects invalid input", () =>
    expect(runBondLengthFromOrder(null).ok).toBe(false));
});
