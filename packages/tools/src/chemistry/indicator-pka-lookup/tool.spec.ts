import { describe, expect, it } from "vitest";
import { runIndicatorPkaLookup } from "./tool.js";

describe("Indicator pKa Lookup", () => {
  it("calculates a valid result", () => {
    const result = runIndicatorPkaLookup({ indicatorName: "phenolphthalein" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.approxPka).toBe(9.7);
  });
  it("rejects invalid input", () =>
    expect(runIndicatorPkaLookup(null).ok).toBe(false));
});
