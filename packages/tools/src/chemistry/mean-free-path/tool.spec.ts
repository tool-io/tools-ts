import { describe, expect, it } from "vitest";
import { runMeanFreePath } from "./tool.js";

describe("Mean Free Path Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMeanFreePath({
      temperatureK: 1,
      pressurePa: 1,
      collisionDiameterNM: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.meanFreePathM).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runMeanFreePath(null).ok).toBe(false));
});
