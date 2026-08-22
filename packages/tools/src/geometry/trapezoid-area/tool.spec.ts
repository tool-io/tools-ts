import { describe, expect, it } from "vitest";
import { runTrapezoidArea } from "./tool.js";
describe("trapezoid area calculator", () => {
  it("computes (3+7)/2 × 4 = 20", () => {
    const r = runTrapezoidArea({ a: 3, b: 7, h: 4 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.area).toBe(20);
  });
});
