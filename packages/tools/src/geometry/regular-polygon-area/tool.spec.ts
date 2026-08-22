import { describe, expect, it } from "vitest";
import { runRegularPolygonArea } from "./tool.js";
describe("regular polygon area calculator", () => {
  it("computes hexagon area correctly", () => {
    const r = runRegularPolygonArea({ sideLength: 1, sides: 6 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.area).toBeCloseTo(2.598076211353316, 6);
  });
});
