import { describe, expect, it } from "vitest";
import { runCircleSectorArea } from "./tool.js";
describe("circle sector area calculator", () => {
  it("computes quarter sector for 90° r=2", () => {
    const r = runCircleSectorArea({ angleDeg: 90, radius: 2 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.area).toBeCloseTo(Math.PI, 9);
  });
});
