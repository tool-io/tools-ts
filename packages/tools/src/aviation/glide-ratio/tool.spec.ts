import { describe, expect, it } from "vitest";
import { glideRatioExample, runGlideRatio } from "./tool.js";

describe("glide ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGlideRatio(glideRatioExample.input)).toEqual({
      ok: true,
      output: glideRatioExample.output,
    });
  });

  it("is the inverse of the climb gradient in fraction form", () => {
    // 1000 ft down over 9000 ft across equals a 1:9 descent.
    expect(
      runGlideRatio({ altitudeLostFt: 9000, horizontalDistanceFt: 1000 }),
    ).toEqual({ ok: true, output: { glideRatio: 0.111111111111 } });
  });

  it("rejects zero altitude loss through execution", () => {
    expect(
      runGlideRatio({ altitudeLostFt: 0, horizontalDistanceFt: 500 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_altitude" }] },
      ok: false,
    });
  });
});
