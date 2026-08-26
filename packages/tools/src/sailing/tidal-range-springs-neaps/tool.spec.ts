import { describe, expect, it } from "vitest";
import {
  runTidalRangeSpringsNeaps,
  tidalRangeSpringsNeapsExample,
} from "./tool.js";

describe("range ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTidalRangeSpringsNeaps(tidalRangeSpringsNeapsExample.input),
    ).toEqual({
      ok: true,
      output: tidalRangeSpringsNeapsExample.output,
    });
  });

  it("supports fractional ranges exactly", () => {
    expect(
      runTidalRangeSpringsNeaps({ neapRangeMeters: 1.5, springRangeMeters: 3 }),
    ).toEqual({ ok: true, output: { rangeRatio: 2 } });
  });

  it("returns one for equal ranges", () => {
    expect(
      runTidalRangeSpringsNeaps({
        neapRangeMeters: 2.5,
        springRangeMeters: 2.5,
      }),
    ).toEqual({ ok: true, output: { rangeRatio: 1 } });
  });

  it("rejects zero spring ranges through calculation and negative ranges through validation", () => {
    expect(
      runTidalRangeSpringsNeaps({ neapRangeMeters: 2, springRangeMeters: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "springRangeMeters" }],
      },
      ok: false,
    });
    expect(
      runTidalRangeSpringsNeaps({ neapRangeMeters: 2, springRangeMeters: -4 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "springRangeMeters" }],
      },
      ok: false,
    });
  });

  it("rejects zero neap ranges through calculation and negative ranges through validation", () => {
    expect(
      runTidalRangeSpringsNeaps({ neapRangeMeters: 0, springRangeMeters: 4 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "neapRangeMeters" }] },
      ok: false,
    });
    expect(
      runTidalRangeSpringsNeaps({ neapRangeMeters: -2, springRangeMeters: 4 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "neapRangeMeters" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runTidalRangeSpringsNeaps({}).ok).toBe(false);
    expect(
      runTidalRangeSpringsNeaps({ neapRangeMeters: 2, springRangeMeters: null })
        .ok,
    ).toBe(false);
    expect(runTidalRangeSpringsNeaps(null).ok).toBe(false);
  });
});
