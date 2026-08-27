import { describe, expect, it } from "vitest";
import {
  runShelfEdgeTrajectoryAngle,
  shelfEdgeTrajectoryAngleExample,
} from "./tool.js";

describe("shelf-edge-trajectory-angle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runShelfEdgeTrajectoryAngle(shelfEdgeTrajectoryAngleExample.input),
    ).toEqual({
      ok: true,
      output: shelfEdgeTrajectoryAngleExample.output,
    });
  });

  it("is 90 degrees for pure aggradation", () => {
    const result = runShelfEdgeTrajectoryAngle({ riseM: 300, runM: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.trajectoryAngleDeg as number).toBe(90);
  });

  it("rejects zero rise with zero run and negative run", () => {
    expect(runShelfEdgeTrajectoryAngle({ riseM: 0, runM: 0 }).ok).toBe(false);
    expect(runShelfEdgeTrajectoryAngle({ riseM: 10, runM: -5 }).ok).toBe(false);
  });
});
