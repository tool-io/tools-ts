import { describe, expect, it } from "vitest";
import { runCircleCircumference } from "./tool.js";

describe("Circle Circumference Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCircleCircumference({ radius: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.circumference).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCircleCircumference(null).ok).toBe(false));
});
