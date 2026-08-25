import { describe, expect, it } from "vitest";
import { mainsailRoachAreaExample, runMainsailRoachArea } from "./tool.js";

describe("Roach Area Calculator", () => {
  it("calculates the canonical example with the default percentage", () =>
    expect(runMainsailRoachArea(mainsailRoachAreaExample.input)).toEqual({
      ok: true,
      output: mainsailRoachAreaExample.output,
    }));
  it("honours a custom roach percentage", () =>
    expect(
      runMainsailRoachArea({
        footLengthMeters: 3.5,
        luffLengthMeters: 10,
        roachPercentage: 20,
      }),
    ).toEqual({ ok: true, output: { roachAreaM2: 3.5 } }));
  it("returns zero area for a zero percentage", () =>
    expect(
      runMainsailRoachArea({
        footLengthMeters: 3.5,
        luffLengthMeters: 10,
        roachPercentage: 0,
      }),
    ).toEqual({ ok: true, output: { roachAreaM2: 0 } }));
  it("accepts the upper bound of twenty-five percent", () =>
    expect(
      runMainsailRoachArea({
        footLengthMeters: 3.5,
        luffLengthMeters: 10,
        roachPercentage: 25,
      }),
    ).toEqual({ ok: true, output: { roachAreaM2: 4.375 } }));
  it("scales with the triangular sail area", () =>
    expect(
      runMainsailRoachArea({ footLengthMeters: 7, luffLengthMeters: 10 }),
    ).toEqual({ ok: true, output: { roachAreaM2: 3.5 } }));
  it("rejects non-positive luff length", () => {
    const result = runMainsailRoachArea({
      footLengthMeters: 3.5,
      luffLengthMeters: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_luff");
  });
  it("rejects non-positive foot length", () => {
    const result = runMainsailRoachArea({
      footLengthMeters: 0,
      luffLengthMeters: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_foot");
  });
  it("rejects percentages outside zero to twenty-five", () => {
    expect(
      runMainsailRoachArea({
        footLengthMeters: 3.5,
        luffLengthMeters: 10,
        roachPercentage: 26,
      }).ok,
    ).toBe(false);
    expect(
      runMainsailRoachArea({
        footLengthMeters: 3.5,
        luffLengthMeters: 10,
        roachPercentage: -1,
      }).ok,
    ).toBe(false);
  });
  it("rejects missing and malformed dimensions", () => {
    expect(runMainsailRoachArea({}).ok).toBe(false);
    expect(
      runMainsailRoachArea({
        footLengthMeters: "3.5",
        luffLengthMeters: 10,
      }).ok,
    ).toBe(false);
  });
});
