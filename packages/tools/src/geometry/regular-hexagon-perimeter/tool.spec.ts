import { describe, expect, it } from "vitest";
import { runRegularHexagonPerimeter } from "./tool.js";

describe("Regular Hexagon Perimeter Calculator", () => {
  it("calculates a valid result", () => {
    expect(runRegularHexagonPerimeter({ side: 7 })).toEqual({
      ok: true,
      output: { perimeter: 42 },
    });
  });

  it("rejects invalid input", () =>
    expect(runRegularHexagonPerimeter(null).ok).toBe(false));
});
