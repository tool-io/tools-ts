import { describe, expect, it } from "vitest";
import { bestGlideSpeedExample, runBestGlideSpeed } from "./tool.js";
describe("best glide speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runBestGlideSpeed(bestGlideSpeedExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.bestGlideKt).toBeCloseTo(
      bestSpeedFor(bestGlideSpeedExample.input.currentWeightLb),
      9,
    );
  });
  function bestSpeedFor(w: number): number {
    return (
      bestGlideSpeedExample.input.publishedBestGlideKt *
      Math.sqrt(w / bestGlideSpeedExample.input.publishedWeightLb)
    );
  }
});
