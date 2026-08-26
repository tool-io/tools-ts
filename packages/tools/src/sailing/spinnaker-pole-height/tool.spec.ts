import { describe, expect, it } from "vitest";
import { runSpinnakerPoleHeight, spinnakerPoleHeightExample } from "./tool.js";

describe("Spinnaker Pole Height", () => {
  it("calculates the canonical example exactly", () => {
    expect(runSpinnakerPoleHeight(spinnakerPoleHeightExample.input)).toEqual({
      ok: true,
      output: { poleTipHeightMeters: 1.035276180410083 },
    });
  });

  it("defaults the elevation to fifteen degrees when omitted", () => {
    expect(runSpinnakerPoleHeight({ poleLengthMeters: 2 })).toEqual({
      ok: true,
      output: { poleTipHeightMeters: 0.5176380902050415 },
    });
  });

  it("returns zero height for a square pole at zero degrees", () => {
    expect(
      runSpinnakerPoleHeight({ elevationDegrees: 0, poleLengthMeters: 4 }),
    ).toEqual({ ok: true, output: { poleTipHeightMeters: 0 } });
  });

  it("reaches the maximum height at forty five degrees", () => {
    expect(
      runSpinnakerPoleHeight({ elevationDegrees: 45, poleLengthMeters: 4 }),
    ).toEqual({
      ok: true,
      output: { poleTipHeightMeters: 2.82842712474619 },
    });
  });

  it("scales linearly with pole length at thirty degrees", () => {
    expect(
      runSpinnakerPoleHeight({ elevationDegrees: 30, poleLengthMeters: 2 }),
    ).toEqual({
      ok: true,
      output: { poleTipHeightMeters: 0.9999999999999999 },
    });
  });

  it("rejects an elevation above forty five degrees", () => {
    expect(
      runSpinnakerPoleHeight({ elevationDegrees: 46, poleLengthMeters: 4 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "elevationDegrees" }] },
      ok: false,
    });
  });

  it("rejects a negative elevation", () => {
    expect(
      runSpinnakerPoleHeight({ elevationDegrees: -1, poleLengthMeters: 4 }).ok,
    ).toBe(false);
  });

  it("rejects zero or negative pole length with a stable error", () => {
    expect(
      runSpinnakerPoleHeight({ elevationDegrees: 15, poleLengthMeters: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "poleLengthMeters" }] },
      ok: false,
    });
    expect(runSpinnakerPoleHeight({ poleLengthMeters: -4 }).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runSpinnakerPoleHeight({
        poleLengthMeters: 4,
        poleWeightKg: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "poleWeightKg" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runSpinnakerPoleHeight(null).ok).toBe(false);
    expect(runSpinnakerPoleHeight({}).ok).toBe(false);
  });
});
