import { describe, expect, it } from "vitest";
import { runCylinderVolume } from "./tool.js";
describe("cylinder volume calculator", () => {
  it("computes volume for r=2 h=5", () => {
    const r = runCylinderVolume({ height: 5, radius: 2 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.volume).toBeCloseTo(Math.PI * 4 * 5, 9);
  });
});
