import { describe, expect, it } from "vitest";
import { laylineDistanceExample, runLaylineDistance } from "./tool.js";

describe("layline distance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runLaylineDistance(laylineDistanceExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.distanceNm).toBeCloseTo(2 / Math.sin(Math.PI / 4), 9);
  });

  it("rejects out-of-range tack angles through execution", () => {
    for (const angle of [0, -5, 90])
      expect(
        runLaylineDistance({ lateralOffsetNm: 2, tackAngleDeg: angle }).ok,
      ).toBe(false);
  });
});
