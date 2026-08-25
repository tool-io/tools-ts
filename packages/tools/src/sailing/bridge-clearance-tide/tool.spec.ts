import { describe, expect, it } from "vitest";
import { bridgeClearanceTideExample, runBridgeClearanceTide } from "./tool.js";

describe("Bridge Clearance Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runBridgeClearanceTide(bridgeClearanceTideExample.input)).toEqual({
      ok: true,
      output: { clearanceMeters: 5.5 },
    });
  });

  it("allows a touch fit with exactly zero clearance", () => {
    expect(
      runBridgeClearanceTide({
        bridgeAirDraftMeters: 20,
        heightOfTideMeters: 2.5,
        vesselAirDraftMeters: 17.5,
      }),
    ).toEqual({ ok: true, output: { clearanceMeters: 0 } });
  });

  it("gains clearance on a negative tide", () => {
    expect(
      runBridgeClearanceTide({
        bridgeAirDraftMeters: 25,
        heightOfTideMeters: -1,
        vesselAirDraftMeters: 18,
      }),
    ).toEqual({ ok: true, output: { clearanceMeters: 8 } });
  });

  it("rejects a passage with insufficient clearance", () => {
    expect(
      runBridgeClearanceTide({
        bridgeAirDraftMeters: 18,
        heightOfTideMeters: 1,
        vesselAirDraftMeters: 18,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "insufficient_clearance" }] },
      ok: false,
    });
  });

  it("rejects non-positive air drafts", () => {
    expect(
      runBridgeClearanceTide({
        bridgeAirDraftMeters: 0,
        heightOfTideMeters: 0,
        vesselAirDraftMeters: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "bridgeAirDraftMeters" }],
      },
      ok: false,
    });
    expect(
      runBridgeClearanceTide({
        bridgeAirDraftMeters: 20,
        heightOfTideMeters: 0,
        vesselAirDraftMeters: -3,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "vesselAirDraftMeters" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    expect(
      runBridgeClearanceTide({
        bridgeAirDraftMeters: Number.POSITIVE_INFINITY,
        heightOfTideMeters: 0,
        vesselAirDraftMeters: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "bridgeAirDraftMeters" }],
      },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runBridgeClearanceTide({
        beamMeters: 4,
        bridgeAirDraftMeters: 25,
        heightOfTideMeters: 1.5,
        vesselAirDraftMeters: 18,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "beamMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runBridgeClearanceTide(null).ok).toBe(false);
    expect(runBridgeClearanceTide({ bridgeAirDraftMeters: 25 }).ok).toBe(false);
  });
});
