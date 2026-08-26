import { describe, expect, it } from "vitest";
import { runRectangleArea, rectangleAreaExample } from "./tool.js";

describe("Rectangle Area Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRectangleArea(rectangleAreaExample.input)).toEqual({
      ok: true,
      output: rectangleAreaExample.output,
    });
  });

  it("rejects invalid input", () =>
    expect(runRectangleArea(null).ok).toBe(false));
});
