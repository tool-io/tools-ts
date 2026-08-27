import { describe, expect, it } from "vitest";
import {
  atterbergConsistencyIndexExample,
  runAtterbergConsistencyIndex,
} from "./tool.js";

describe("atterberg-consistency-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAtterbergConsistencyIndex(atterbergConsistencyIndexExample.input),
    ).toEqual({
      ok: true,
      output: atterbergConsistencyIndexExample.output,
    });
  });

  it("returns one when water content equals the plastic limit", () => {
    const result = runAtterbergConsistencyIndex({
      liquidLimitPercent: 38,
      waterContentPercent: 21,
      plasticityIndexPercent: 17,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.consistencyIndex as number).toBe(1);
  });

  it("rejects a zero plasticity index", () => {
    expect(
      runAtterbergConsistencyIndex({
        liquidLimitPercent: 38,
        waterContentPercent: 25,
        plasticityIndexPercent: 0,
      }).ok,
    ).toBe(false);
  });
});
