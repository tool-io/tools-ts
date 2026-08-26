import { describe, expect, it } from "vitest";
import {
  marinaBerthDepthTideExample,
  runMarinaBerthDepthTide,
} from "./tool.js";

describe("Berth Depth Check", () => {
  it("calculates the canonical example exactly", () => {
    expect(runMarinaBerthDepthTide(marinaBerthDepthTideExample.input)).toEqual({
      ok: true,
      output: { availableDepthMeters: 2.5, sufficient: true },
    });
  });

  it("treats an exact match of draft and depth as sufficient", () => {
    expect(
      runMarinaBerthDepthTide({
        berthDepthMeters: 1.8,
        heightOfTideMeters: 0.7,
        vesselDraftMeters: 2.5,
      }),
    ).toEqual({
      ok: true,
      output: { availableDepthMeters: 2.5, sufficient: true },
    });
  });

  it("flags insufficient water below the draft", () => {
    expect(
      runMarinaBerthDepthTide({
        berthDepthMeters: 2,
        heightOfTideMeters: -0.5,
        vesselDraftMeters: 2.5,
      }),
    ).toEqual({
      ok: true,
      output: { availableDepthMeters: 1.5, sufficient: false },
    });
  });

  it("adds a rising tide to the charted berth depth", () => {
    const result = runMarinaBerthDepthTide({
      berthDepthMeters: 2.6,
      heightOfTideMeters: 1.3,
      vesselDraftMeters: 3.9,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.availableDepthMeters).toBeCloseTo(3.9, 10);
    expect(result.output.sufficient).toBe(true);
  });

  it("rejects non-positive berth depth and vessel draft", () => {
    expect(
      runMarinaBerthDepthTide({
        berthDepthMeters: 0,
        heightOfTideMeters: 0,
        vesselDraftMeters: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "berthDepthMeters" }],
      },
      ok: false,
    });
    expect(
      runMarinaBerthDepthTide({
        berthDepthMeters: 2,
        heightOfTideMeters: 0,
        vesselDraftMeters: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "vesselDraftMeters" }],
      },
      ok: false,
    });
  });

  it("accepts any signed tide height including below datum", () => {
    expect(
      runMarinaBerthDepthTide({
        berthDepthMeters: 3,
        heightOfTideMeters: -3.2,
        vesselDraftMeters: 1,
      }).ok,
    ).toBe(true);
  });

  it("rejects unknown fields", () => {
    expect(
      runMarinaBerthDepthTide({
        beamMeters: 3,
        berthDepthMeters: 2,
        heightOfTideMeters: 0.5,
        vesselDraftMeters: 2.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "beamMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runMarinaBerthDepthTide(null).ok).toBe(false);
    expect(runMarinaBerthDepthTide({ berthDepthMeters: 2 }).ok).toBe(false);
  });
});
