import { describe, expect, it } from "vitest";
import { runTrueWindSpeed, trueWindSpeedExample as example } from "./tool.js";
describe("true wind speed", () => {
  it("reproduces its vector example", () =>
    expect(runTrueWindSpeed(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("handles zero apparent wind", () =>
    expect(
      runTrueWindSpeed({
        apparentWindAngleDeg: 0,
        apparentWindSpeedKt: 0,
        boatSpeedKt: 5,
      }),
    ).toEqual({ ok: true, output: { trueWindSpeedKt: 5 } }));
  it("rejects negative speeds", () =>
    expect(
      runTrueWindSpeed({
        apparentWindAngleDeg: 0,
        apparentWindSpeedKt: -1,
        boatSpeedKt: 5,
      }).ok,
    ).toBe(false));
});
