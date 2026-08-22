import { describe, expect, it } from "vitest";
import { runRectangleArea, RectangleAreaExample } from "./tool.js";

describe("Rectangle Area Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRectangleArea(RectangleAreaExample.input)).toEqual({
      ok: true,
      output: RectangleAreaExample.output,
    });
  });

  it("rejects invalid input", () =>
    expect(runRectangleArea(null).ok).toBe(false));
});
