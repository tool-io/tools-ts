import { describe, expect, it } from "vitest";
import { tidalStreamRateExample, runTidalStreamRate } from "./tool.js";

describe("tidal stream rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTidalStreamRate(tidalStreamRateExample.input)).toEqual({
      ok: true,
      output: tidalStreamRateExample.output,
    });
  });

  it("rejects zero elapsed time through execution", () => {
    expect(
      runTidalStreamRate({ driftDistanceNm: 2, timeElapsedHours: 0 }),
    ).toMatchObject({
      error: {},
      ok: false,
    });
  });

  it("rejects a negative drift distance", () => {
    expect(
      runTidalStreamRate({ driftDistanceNm: -1, timeElapsedHours: 1 }).ok,
    ).toBe(false);
  });
});
