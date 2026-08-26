import { describe, expect, it } from "vitest";
import { runTriangleArea, triangleAreaExample } from "./tool.js";

describe("Triangle Area Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTriangleArea(triangleAreaExample.input)).toEqual({
      ok: true,
      output: triangleAreaExample.output,
    });
  });

  it("rejects invalid input", () =>
    expect(runTriangleArea(null).ok).toBe(false));
});
