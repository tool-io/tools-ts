import { describe, expect, it } from "vitest";
import { approachGradientExample, runApproachGradient } from "./tool.js";
describe("approach gradient calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runApproachGradient(approachGradientExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.gradientPercent).toBeCloseTo(5.233606911447346, 9);
  });
});
