import { describe, expect, it } from "vitest";
import { seismicTwoWayTimeExample, runSeismicTwoWayTime } from "./tool.js";

describe("geology/seismic-two-way-time", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeismicTwoWayTime(seismicTwoWayTimeExample.input)).toEqual({
      ok: true,
      output: seismicTwoWayTimeExample.output,
    });
  });

  it("gives twice the one-way time", () => {
    const result = runSeismicTwoWayTime({
      depthM: 3000,
      intervalVelocityMPers: 1500,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.oneWayTimeS).toBe(2);
    expect(result.output.twoWayTimeS).toBe(4);
  });

  it("rejects negative depth and non-positive velocity", () => {
    expect(
      runSeismicTwoWayTime({ depthM: -1, intervalVelocityMPers: 2800 }).ok,
    ).toBe(false);
    expect(
      runSeismicTwoWayTime({ depthM: 2000, intervalVelocityMPers: 0 }).ok,
    ).toBe(false);
  });
});
