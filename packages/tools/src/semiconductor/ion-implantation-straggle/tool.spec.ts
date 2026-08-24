import { describe, expect, it } from "vitest";
import { implantStraggleExample, runImplantStraggle } from "./tool.js";

describe("Implant Straggle Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runImplantStraggle(implantStraggleExample.input)).toEqual({
      ok: true,
      output: implantStraggleExample.output,
    });
  });

  it("multiplies projected range by the supplied straggle fraction", () => {
    expect(
      runImplantStraggle({ projectedRangeNm: 80, straggleFraction: 0.5 }),
    ).toEqual({ ok: true, output: { straggleNm: 40 } });
  });

  it("accepts a full-range fraction", () => {
    expect(
      runImplantStraggle({ projectedRangeNm: 80, straggleFraction: 1 }),
    ).toEqual({ ok: true, output: { straggleNm: 80 } });
  });

  it("requires a positive range and a fraction above zero through one", () => {
    for (const input of [
      { projectedRangeNm: 80 },
      { projectedRangeNm: 0, straggleFraction: 0.35 },
      { projectedRangeNm: 80, straggleFraction: 0 },
      { projectedRangeNm: 80, straggleFraction: 1.01 },
    ])
      expect(runImplantStraggle(input).ok).toBe(false);
  });
});
