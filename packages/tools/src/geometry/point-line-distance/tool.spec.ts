import { describe, expect, it } from "vitest";
import { runPointLineDistance } from "./tool.js";
describe("point line distance calculator", () => {
  it("computes distance from origin to horizontal line y=0 through (3,4)", () => {
    const r = runPointLineDistance({
      px: 3,
      py: 4,
      x1: 0,
      y1: 0,
      x2: 10,
      y2: 0,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.distance).toBeCloseTo(4, 9);
  });
});
