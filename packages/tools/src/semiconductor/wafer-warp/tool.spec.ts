import { describe, expect, it } from "vitest";
import { runWaferWarp, waferWarpExample } from "./tool.js";

describe("wafer peak-to-valley warp", () => {
  it("reproduces the documented example", () =>
    expect(runWaferWarp(waferWarpExample.input)).toEqual({
      ok: true,
      output: waferWarpExample.output,
    }));
  it("returns zero when extrema coincide", () =>
    expect(runWaferWarp({ peakDeviationUm: 2, valleyDeviationUm: 2 })).toEqual({
      ok: true,
      output: { warpUm: 0 },
    }));
  it("rejects reversed extrema instead of silently swapping them", () =>
    expect(
      runWaferWarp({ peakDeviationUm: -1, valleyDeviationUm: 2 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_extrema_order" }] },
    }));
});
