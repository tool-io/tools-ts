import { describe, expect, it } from "vitest";
import {
  calculateFavoredTackFromShift,
  favoredTackFromShiftExample,
  runFavoredTackFromShift,
} from "./tool.js";

describe("Favored Tack From Shift", () => {
  it("publishes an executable example", () =>
    expect(runFavoredTackFromShift(favoredTackFromShiftExample.input)).toEqual({
      ok: true,
      output: favoredTackFromShiftExample.output,
    }));

  it.each([
    [45, "starboard"],
    [1, "starboard"],
    [0.5, "starboard"],
    [-45, "port"],
    [-1, "port"],
    [-0.5, "port"],
  ])("favours %s degrees on the %s tack", (shiftDegrees, expected) => {
    expect(calculateFavoredTackFromShift({ shiftDegrees })).toEqual({
      favoredTack: expected,
    });
    expect(runFavoredTackFromShift({ shiftDegrees })).toEqual({
      ok: true,
      output: { favoredTack: expected },
    });
  });

  it("calls an unshifted breeze even", () =>
    expect(runFavoredTackFromShift({ shiftDegrees: 0 })).toEqual({
      ok: true,
      output: { favoredTack: "even" },
    }));

  it("accepts the full signed range", () => {
    expect(runFavoredTackFromShift({ shiftDegrees: -45 }).ok).toBe(true);
    expect(runFavoredTackFromShift({ shiftDegrees: 45 }).ok).toBe(true);
  });

  it("rejects shifts beyond forty-five degrees", () => {
    for (const shiftDegrees of [-45.5, 45.5])
      expect(runFavoredTackFromShift({ shiftDegrees }).ok).toBe(false);
  });

  it("rejects non-finite input", () => {
    expect(runFavoredTackFromShift({ shiftDegrees: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runFavoredTackFromShift({ shiftDegrees: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects missing or malformed input", () => {
    expect(runFavoredTackFromShift({}).ok).toBe(false);
    expect(runFavoredTackFromShift({ shiftDegrees: "10" }).ok).toBe(false);
    expect(runFavoredTackFromShift(null)).toMatchObject({ ok: false });
  });

  it("rejects unknown input fields", () =>
    expect(runFavoredTackFromShift({ shiftDegrees: 5, extra: true }).ok).toBe(
      false,
    ));
});
