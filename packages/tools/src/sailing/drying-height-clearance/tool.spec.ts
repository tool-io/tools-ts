import { describe, expect, it } from "vitest";
import {
  dryingHeightClearanceExample,
  runDryingHeightClearance,
} from "./tool.js";

describe("Drying Height Clearance", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runDryingHeightClearance(dryingHeightClearanceExample.input),
    ).toEqual({ ok: true, output: { depthInMeters: 1.5 } });
  });

  it("returns a signed depth when the tide covers the patch", () => {
    expect(
      runDryingHeightClearance({
        chartedDryingHeightMeters: 1.2,
        heightOfTideMeters: 3.7,
      }),
    ).toEqual({ ok: true, output: { depthInMeters: 2.5 } });
  });

  it("returns zero depth at the moment of covering", () => {
    expect(
      runDryingHeightClearance({
        chartedDryingHeightMeters: 2.4,
        heightOfTideMeters: 2.4,
      }),
    ).toEqual({ ok: true, output: { depthInMeters: 0 } });
  });

  it("returns negative clearance when the patch is exposed", () => {
    expect(
      runDryingHeightClearance({
        chartedDryingHeightMeters: 3.3,
        heightOfTideMeters: 0,
      }),
    ).toEqual({ ok: true, output: { depthInMeters: -3.3 } });
  });

  it("accepts a zero drying height and rejects negative values", () => {
    expect(
      runDryingHeightClearance({
        chartedDryingHeightMeters: 0,
        heightOfTideMeters: 1,
      }),
    ).toEqual({ ok: true, output: { depthInMeters: 1 } });
    expect(
      runDryingHeightClearance({
        chartedDryingHeightMeters: -2,
        heightOfTideMeters: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative tide heights at the schema level", () => {
    expect(
      runDryingHeightClearance({
        chartedDryingHeightMeters: 2,
        heightOfTideMeters: -0.5,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "heightOfTideMeters" }],
      },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runDryingHeightClearance({
        chartedDryingHeightMeters: 2,
        heightOfTideMeters: 3.5,
        windKt: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "windKt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runDryingHeightClearance(null).ok).toBe(false);
    expect(runDryingHeightClearance({}).ok).toBe(false);
  });
});
