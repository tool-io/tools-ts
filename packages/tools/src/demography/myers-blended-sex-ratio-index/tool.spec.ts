import { describe, expect, it } from "vitest";
import {
  myersBlendedSexRatioIndexExample,
  runMyersBlendedSexRatioIndex,
} from "./tool.js";

describe("myers-blended-sex-ratio-index", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMyersBlendedSexRatioIndex(myersBlendedSexRatioIndexExample.input),
    ).toEqual({
      ok: true,
      output: myersBlendedSexRatioIndexExample.output,
    });
  });

  it("yields a zero index when every blended ratio equals one hundred", () => {
    const r = runMyersBlendedSexRatioIndex({
      maleBySingleAge: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      femaleBySingleAge: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
      minimumAge: 20,
    });
    expect(r.ok && r.output.myersSexRatioIndex).toBe(0);
  });

  it("rejects lists shorter than ten ages", () => {
    expect(
      runMyersBlendedSexRatioIndex({
        maleBySingleAge: [1, 2, 3],
        femaleBySingleAge: [1, 2, 3],
        minimumAge: 20,
      }).ok,
    ).toBe(false);
  });
});
