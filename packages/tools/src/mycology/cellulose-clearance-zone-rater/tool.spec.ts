import { describe, expect, it } from "vitest";
import {
  celluloseClearanceZoneRaterExample,
  runCelluloseClearanceZoneRater,
} from "./tool.js";

describe("Clearance Zone Rater", () => {
  const thresholds = { moderateMinimumMm: 5, strongMinimumMm: 15.1 };
  it("matches the canonical example", () =>
    expect(
      runCelluloseClearanceZoneRater(celluloseClearanceZoneRaterExample.input),
    ).toEqual({
      ok: true,
      output: celluloseClearanceZoneRaterExample.output,
    }));
  it("rates zero as none", () =>
    expect(
      runCelluloseClearanceZoneRater({ ...thresholds, zoneMm: 0 }),
    ).toEqual({
      ok: true,
      output: { clearanceRating: "none" },
    }));
  it("rates small zones as weak", () =>
    expect(
      runCelluloseClearanceZoneRater({ ...thresholds, zoneMm: 4.9 }),
    ).toEqual({
      ok: true,
      output: { clearanceRating: "weak" },
    }));
  it("rates five millimetres as moderate", () =>
    expect(
      runCelluloseClearanceZoneRater({ ...thresholds, zoneMm: 5 }),
    ).toEqual({
      ok: true,
      output: { clearanceRating: "moderate" },
    }));
  it("rates fifteen millimetres as moderate", () =>
    expect(
      runCelluloseClearanceZoneRater({ ...thresholds, zoneMm: 15 }),
    ).toEqual({
      ok: true,
      output: { clearanceRating: "moderate" },
    }));
  it("rates just above fifteen millimetres as strong", () =>
    expect(
      runCelluloseClearanceZoneRater({ ...thresholds, zoneMm: 15.1 }),
    ).toEqual({
      ok: true,
      output: { clearanceRating: "strong" },
    }));
  it("rates wide zones as strong", () =>
    expect(
      runCelluloseClearanceZoneRater({ ...thresholds, zoneMm: 40 }),
    ).toEqual({
      ok: true,
      output: { clearanceRating: "strong" },
    }));
  it("rejects negative zones", () =>
    expect(
      runCelluloseClearanceZoneRater({ ...thresholds, zoneMm: -0.5 }).ok,
    ).toBe(false));
  it("rejects overlapping category thresholds", () =>
    expect(
      runCelluloseClearanceZoneRater({
        moderateMinimumMm: 10,
        strongMinimumMm: 10,
        zoneMm: 12,
      }).ok,
    ).toBe(false));
});
