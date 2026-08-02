import { describe, expect, it } from "vitest";
import { fisherZTransformExample, runFisherZTransform } from "./tool.js";
describe("Fisher Z-Transformation Calculator", () => {
  it("calculates a valid result", () => {
    const result = runFisherZTransform({ correlation: 0.5 });
    expect(result.ok && result.output.z).toBeCloseTo(0.5493061443);
  });
  it("rejects invalid input", () =>
    expect(runFisherZTransform(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runFisherZTransform(fisherZTransformExample.input).ok).toBe(true));
});
