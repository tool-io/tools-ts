import { describe, expect, it } from "vitest";
import {
  runWormholeDensityRater,
  wormholeDensityRaterExample,
} from "./tool.js";

describe("wormhole-density-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWormholeDensityRater(wormholeDensityRaterExample.input)).toEqual({
      ok: true,
      output: wormholeDensityRaterExample.output,
    });
  });

  it("rates an untouched leaf as none", () => {
    const result = runWormholeDensityRater({
      pageAreaSquareCm: 300,
      wormholeCount: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.infestationRating as string).toBe("none");
    expect(result.output.wormholesPerSquareDecimetre as number).toBe(0);
  });

  it("rejects non-positive areas", () => {
    expect(
      runWormholeDensityRater({ pageAreaSquareCm: 0, wormholeCount: 5 }).ok,
    ).toBe(false);
  });
});
