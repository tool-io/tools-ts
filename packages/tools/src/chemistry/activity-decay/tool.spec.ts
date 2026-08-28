import { describe, expect, it } from "vitest";
import { runActivityDecay } from "./tool.js";

describe("Activity Decay Calculator", () => {
  it("calculates a valid result", () => {
    const result = runActivityDecay({
      elapsedSeconds: 10,
      halfLifeSeconds: 5,
      initialActivityBq: 100,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.activityBq).toBeCloseTo(25, 9);
  });

  it("rejects invalid input", () =>
    expect(runActivityDecay(null).ok).toBe(false));
});
