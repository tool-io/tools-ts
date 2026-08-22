import { describe, expect, it } from "vitest";
import { runWeightedSum } from "./tool.js";

describe("weighted sum calculator", () => {
  it("computes 2*3 + 1*4 = 10", () => {
    const r = runWeightedSum({ values: [3, 4], weights: [2, 1] });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.sum).toBe(10);
  });

  it("returns zero for empty lists through execution", () => {
    const r = runWeightedSum({ values: [], weights: [] });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.sum).toBe(0);
  });

  it("rejects mismatched lengths through execution", () => {
    expect(runWeightedSum({ values: [1], weights: [1, 2] }).ok).toBe(false);
  });
});
