import { describe, expect, it } from "vitest";
import { comfortRatioExample, runComfortRatio } from "./tool.js";

describe("Comfort Ratio Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runComfortRatio(comfortRatioExample.input)).toEqual({
      ok: true,
      output: { comfortRatio: 135.72088082974537 },
    });
  });

  it("rises linearly with displacement at fixed waterline", () => {
    expect(
      runComfortRatio({ displacementPounds: 26000, waterlineLengthFeet: 50 }),
    ).toEqual({ ok: true, output: { comfortRatio: 217.15340932759258 } });
  });

  it("applies the four-thirds length law when waterline halves", () => {
    expect(
      runComfortRatio({ displacementPounds: 16250, waterlineLengthFeet: 25 }),
    ).toEqual({ ok: true, output: { comfortRatio: 341.99518933533943 } });
  });

  it("computes a fractional ratio for a typical cruiser", () => {
    expect(
      runComfortRatio({ displacementPounds: 9000, waterlineLengthFeet: 25 }),
    ).toEqual({
      ok: true,
      output: { comfortRatio: 189.4127202472649 },
    });
  });

  it("rejects zero displacement with a stable error", () => {
    expect(
      runComfortRatio({ displacementPounds: 0, waterlineLengthFeet: 28 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "displacementPounds" }],
      },
      ok: false,
    });
  });

  it("rejects a negative waterline length", () => {
    expect(
      runComfortRatio({ displacementPounds: 9000, waterlineLengthFeet: -1 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite displacement", () => {
    expect(
      runComfortRatio({
        displacementPounds: Number.POSITIVE_INFINITY,
        waterlineLengthFeet: 28,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runComfortRatio({
        beamFt: 10,
        displacementPounds: 16250,
        waterlineLengthFeet: 50,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "beamFt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runComfortRatio(null).ok).toBe(false);
    expect(runComfortRatio({ displacementPounds: 16250 }).ok).toBe(false);
  });
});
