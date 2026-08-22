import { describe, expect, it } from "vitest";
import { glideDistanceExample, runGlideDistance } from "./tool.js";

describe("glide distance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGlideDistance(glideDistanceExample.input)).toEqual({
      ok: true,
      output: glideDistanceExample.output,
    });
  });

  it("scales linearly with altitude and ratio", () => {
    const low = runGlideDistance({ altitudeFt: 2500, glideRatio: 9 });
    if (!low.ok) throw new Error("expected success");
    expect(low.output.distanceNm).toBeCloseTo(7.4060475162 / 2, 9);
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { altitudeFt: 0, glideRatio: 9 },
      { altitudeFt: 5000, glideRatio: -1 },
    ])
      expect(runGlideDistance(bad).ok).toBe(false);
  });
});
