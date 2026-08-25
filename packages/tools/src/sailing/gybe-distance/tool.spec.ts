import { describe, expect, it } from "vitest";
import { gybeDistanceExample, runGybeDistance } from "./tool.js";

describe("gybe distance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGybeDistance(gybeDistanceExample.input)).toEqual({
      ok: true,
      output: gybeDistanceExample.output,
    });
  });

  it("rejects out-of-range gybe angles through execution", () => {
    for (const angle of [0, 180])
      expect(
        runGybeDistance({ gybeAngleDeg: angle, lateralOffsetNm: 2 }).ok,
      ).toBe(false);
  });
});
