import { describe, expect, it } from "vitest";
import {
  runSpinnakerTackPosition,
  spinnakerTackPositionExample,
} from "./tool.js";

describe("Spinnaker Tack Height", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runSpinnakerTackPosition(spinnakerTackPositionExample.input),
    ).toEqual({
      ok: true,
      output: { tackHeightCm: 50 },
    });
  });

  it("defaults the luff percentage to ninety five when omitted", () => {
    expect(runSpinnakerTackPosition({ luffLengthMeters: 3.33 })).toEqual({
      ok: true,
      output: { tackHeightCm: 17 },
    });
  });

  it("leaves half the luff at fifty percent hoist", () => {
    expect(
      runSpinnakerTackPosition({ luffLengthMeters: 10, luffPercentage: 50 }),
    ).toEqual({ ok: true, output: { tackHeightCm: 500 } });
  });

  it("returns zero at a fully hoisted one hundred percent luff", () => {
    expect(
      runSpinnakerTackPosition({ luffLengthMeters: 10, luffPercentage: 100 }),
    ).toEqual({ ok: true, output: { tackHeightCm: 0 } });
  });

  it("accepts the inclusive bounds of fifty and one hundred percent", () => {
    expect(
      runSpinnakerTackPosition({ luffLengthMeters: 8, luffPercentage: 50 }).ok,
    ).toBe(true);
    expect(
      runSpinnakerTackPosition({ luffLengthMeters: 8, luffPercentage: 100 }).ok,
    ).toBe(true);
  });

  it("rounds fractional heights to whole centimeters", () => {
    expect(
      runSpinnakerTackPosition({ luffLengthMeters: 7.77, luffPercentage: 90 }),
    ).toEqual({ ok: true, output: { tackHeightCm: 78 } });
  });

  it("rejects a percentage below fifty", () => {
    expect(
      runSpinnakerTackPosition({ luffLengthMeters: 10, luffPercentage: 49 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "luffPercentage" }] },
      ok: false,
    });
  });

  it("rejects zero luff length with a stable error", () => {
    expect(
      runSpinnakerTackPosition({ luffLengthMeters: 0, luffPercentage: 95 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "luffLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runSpinnakerTackPosition({
        footLengthMeters: 5,
        luffLengthMeters: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "footLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runSpinnakerTackPosition(null).ok).toBe(false);
    expect(runSpinnakerTackPosition({}).ok).toBe(false);
  });
});
