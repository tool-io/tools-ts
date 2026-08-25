import { describe, expect, it } from "vitest";
import {
  pickPathDistanceSerpentineEstimateExample,
  runPickPathDistanceSerpentineEstimate,
} from "./tool.js";

describe("pick-path-distance-serpentine-estimate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPickPathDistanceSerpentineEstimate(
        pickPathDistanceSerpentineEstimateExample.input,
      ),
    ).toEqual({
      ok: true,
      output: pickPathDistanceSerpentineEstimateExample.output,
    });
  });

  it("charges no cross-aisle travel for a single-aisle route", () => {
    const result = runPickPathDistanceSerpentineEstimate({
      aislesTraversed: 1,
      aisleLengthM: 30,
      aisleCenterSpacingM: 3.4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.horizontalTravelM as number).toBe(0);
    expect(result.output.totalPickPathM as number).toBe(30);
  });
  it("rejects zero aisles", () => {
    expect(
      runPickPathDistanceSerpentineEstimate({
        aislesTraversed: 0,
        aisleLengthM: 30,
        aisleCenterSpacingM: 3.4,
      }).ok,
    ).toBe(false);
  });
});
