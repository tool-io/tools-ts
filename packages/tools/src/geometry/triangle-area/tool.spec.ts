import { describe, expect, it } from "vitest";
import { runTriangleArea, TriangleAreaExample } from "./tool.js";

describe("Triangle Area Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTriangleArea(TriangleAreaExample.input)).toEqual({
      ok: true,
      output: TriangleAreaExample.output,
    });
  });

  it("rejects invalid input", () =>
    expect(runTriangleArea(null).ok).toBe(false));
});
