import { describe, expect, it } from "vitest";
import { runTideHeightAtTime, tideHeightAtTimeExample } from "./tool.js";

describe("tide height cosine curve", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTideHeightAtTime(tideHeightAtTimeExample.input)).toEqual({
      ok: true,
      output: tideHeightAtTimeExample.output,
    });
  });

  it("returns the high water at the zero-hour boundary", () => {
    expect(
      runTideHeightAtTime({
        highWaterMeters: 4,
        hoursFromHigh: 0,
        lowWaterMeters: 1,
      }),
    ).toEqual({ ok: true, output: { tideHeightMeters: 4 } });
  });

  it("returns the low water at the six-hour boundary", () => {
    expect(
      runTideHeightAtTime({
        highWaterMeters: 4,
        hoursFromHigh: 6,
        lowWaterMeters: 1,
      }),
    ).toEqual({ ok: true, output: { tideHeightMeters: 1 } });
  });

  it("interpolates a quarter of the way through the cycle exactly", () => {
    expect(
      runTideHeightAtTime({
        highWaterMeters: 2,
        hoursFromHigh: 1.5,
        lowWaterMeters: 0,
      }),
    ).toEqual({ ok: true, output: { tideHeightMeters: 1.7071067811865475 } });
  });

  it("rejects hours before high water through validation", () => {
    for (const hoursFromHigh of [-0.5, -1])
      expect(
        runTideHeightAtTime({
          highWaterMeters: 4,
          hoursFromHigh,
          lowWaterMeters: 1,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "hoursFromHigh" }] },
        ok: false,
      });
  });

  it("rejects hours beyond half the cycle through validation", () => {
    for (const hoursFromHigh of [6.1, 12])
      expect(
        runTideHeightAtTime({
          highWaterMeters: 4,
          hoursFromHigh,
          lowWaterMeters: 1,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field", field: "hoursFromHigh" }] },
        ok: false,
      });
  });

  it("rejects a high-water level below low water", () => {
    expect(
      runTideHeightAtTime({
        highWaterMeters: 1,
        hoursFromHigh: 3,
        lowWaterMeters: 4,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_levels" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runTideHeightAtTime({}).ok).toBe(false);
    expect(
      runTideHeightAtTime({
        highWaterMeters: "high",
        hoursFromHigh: 3,
        lowWaterMeters: 1,
      }).ok,
    ).toBe(false);
    expect(runTideHeightAtTime(null).ok).toBe(false);
  });
});
