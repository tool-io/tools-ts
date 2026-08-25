import { describe, expect, it } from "vitest";
import {
  compassDeviationLookupExample,
  runCompassDeviationLookup,
} from "./tool.js";

describe("Compass Deviation Lookup Calculator", () => {
  it("calculates the canonical example", () =>
    expect(
      runCompassDeviationLookup(compassDeviationLookupExample.input),
    ).toEqual({
      ok: true,
      output: compassDeviationLookupExample.output,
    }));
  it("returns exact table values at entry headings", () => {
    expect(runCompassDeviationLookup({ headingDeg: 0 })).toEqual({
      ok: true,
      output: { deviationDeg: 0 },
    });
    expect(runCompassDeviationLookup({ headingDeg: 90 })).toEqual({
      ok: true,
      output: { deviationDeg: -2 },
    });
    expect(runCompassDeviationLookup({ headingDeg: 180 })).toEqual({
      ok: true,
      output: { deviationDeg: -1 },
    });
    expect(runCompassDeviationLookup({ headingDeg: 270 })).toEqual({
      ok: true,
      output: { deviationDeg: 3 },
    });
    expect(runCompassDeviationLookup({ headingDeg: 360 })).toEqual({
      ok: true,
      output: { deviationDeg: 0 },
    });
  });
  it("interpolates midpoints linearly within each segment", () => {
    expect(runCompassDeviationLookup({ headingDeg: 135 })).toEqual({
      ok: true,
      output: { deviationDeg: -1.5 },
    });
    expect(runCompassDeviationLookup({ headingDeg: 225 })).toEqual({
      ok: true,
      output: { deviationDeg: 1 },
    });
    expect(runCompassDeviationLookup({ headingDeg: 315 })).toEqual({
      ok: true,
      output: { deviationDeg: 1.5 },
    });
  });
  it("interpolates fractional positions between entries", () => {
    const result = runCompassDeviationLookup({ headingDeg: 60 });
    expect(result).toEqual({
      ok: true,
      output: { deviationDeg: -1.3333333333333333 },
    });
  });
  it("rejects headings outside the table range", () => {
    expect(runCompassDeviationLookup({ headingDeg: -1 }).ok).toBe(false);
    expect(runCompassDeviationLookup({ headingDeg: 361 }).ok).toBe(false);
  });
  it("rejects non-integer and malformed input", () => {
    expect(runCompassDeviationLookup({ headingDeg: 45.5 }).ok).toBe(false);
    expect(runCompassDeviationLookup(null).ok).toBe(false);
    expect(runCompassDeviationLookup({}).ok).toBe(false);
    expect(runCompassDeviationLookup({ headingDeg: "90" }).ok).toBe(false);
  });
});
