import { describe, expect, it } from "vitest";
import {
  rockQualityDesignationRqdExample,
  runRockQualityDesignationRqd,
} from "./tool.js";

describe("rock-quality-designation-rqd", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRockQualityDesignationRqd(rockQualityDesignationRqdExample.input),
    ).toEqual({
      ok: true,
      output: rockQualityDesignationRqdExample.output,
    });
  });

  it("gives 100 percent for fully intact core", () => {
    const result = runRockQualityDesignationRqd({
      coreRunLengthCm: 100,
      pieceLengthsCm: [50, 50],
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rqdPercent as number).toBe(100);
  });

  it("rejects non-positive core run lengths", () => {
    expect(
      runRockQualityDesignationRqd({ coreRunLengthCm: 0, pieceLengthsCm: [10] })
        .ok,
    ).toBe(false);
  });
});
