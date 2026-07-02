import { describe, expect, it } from "vitest";
import { runAspectRatio } from "./tool.js";
describe("Aspect Ratio Calculator", () => {
  it("calculates a valid result", () => {
    const result = runAspectRatio({ width: 1920, height: 1080 });
    expect(result).toEqual({
      ok: true,
      output: {
        ratio: 1920 / 1080,
        reducedWidth: 16,
        reducedHeight: 9,
        formatted: "16:9",
      },
    });
  });
  it("rejects invalid input", () =>
    expect(runAspectRatio(null).ok).toBe(false));
});
