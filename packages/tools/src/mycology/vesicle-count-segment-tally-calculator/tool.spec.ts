import { describe, expect, it } from "vitest";
import {
  runVesicleCountSegmentTallyCalculator,
  vesicleCountSegmentTallyCalculatorExample,
} from "./tool.js";

describe("Vesicle Tally", () => {
  it("matches the canonical example", () =>
    expect(
      runVesicleCountSegmentTallyCalculator(
        vesicleCountSegmentTallyCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: vesicleCountSegmentTallyCalculatorExample.output,
    }));
  it("returns zero when no vesicles are counted", () =>
    expect(
      runVesicleCountSegmentTallyCalculator({
        segmentsViewedInt: 12,
        totalVesiclesInt: 0,
      }),
    ).toEqual({ ok: true, output: { meanVesiclesPerSegment: 0 } }));
  it("supports a single segment", () =>
    expect(
      runVesicleCountSegmentTallyCalculator({
        segmentsViewedInt: 1,
        totalVesiclesInt: 5,
      }),
    ).toEqual({ ok: true, output: { meanVesiclesPerSegment: 5 } }));
  it("produces fractional means", () =>
    expect(
      runVesicleCountSegmentTallyCalculator({
        segmentsViewedInt: 4,
        totalVesiclesInt: 10,
      }),
    ).toEqual({ ok: true, output: { meanVesiclesPerSegment: 2.5 } }));
  it("handles tallies larger than the segment count", () =>
    expect(
      runVesicleCountSegmentTallyCalculator({
        segmentsViewedInt: 3,
        totalVesiclesInt: 999,
      }),
    ).toEqual({ ok: true, output: { meanVesiclesPerSegment: 333 } }));
  it("rejects zero segments viewed", () =>
    expect(
      runVesicleCountSegmentTallyCalculator({
        segmentsViewedInt: 0,
        totalVesiclesInt: 10,
      }).ok,
    ).toBe(false));
  it("rejects negative vesicle totals", () =>
    expect(
      runVesicleCountSegmentTallyCalculator({
        segmentsViewedInt: 4,
        totalVesiclesInt: -1,
      }).ok,
    ).toBe(false));
  it("rejects fractional segment counts", () =>
    expect(
      runVesicleCountSegmentTallyCalculator({
        segmentsViewedInt: 2.5,
        totalVesiclesInt: 10,
      }).ok,
    ).toBe(false));
});
