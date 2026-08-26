import { describe, expect, it } from "vitest";
import {
  calculateUnderKeelClearance,
  runUnderKeelClearance,
  underKeelClearanceExample,
} from "./tool.js";

describe("UKC Calculator", () => {
  it("publishes an executable example", () =>
    expect(runUnderKeelClearance(underKeelClearanceExample.input)).toEqual({
      ok: true,
      output: underKeelClearanceExample.output,
    }));

  it.each([
    [12, 8, 4],
    [10.5, 3.75, 6.75],
    [30, 12.5, 17.5],
    [100, 99.99, 0.010000000000005116],
  ])(
    "subtracts the draft from the water depth",
    (waterDepthMeters, vesselDraftMeters, expected) => {
      expect(
        calculateUnderKeelClearance({ vesselDraftMeters, waterDepthMeters }),
      ).toEqual({
        underKeelClearanceMeters: expected,
      });
    },
  );

  it("allows exactly zero clearance when afloat", () =>
    expect(
      runUnderKeelClearance({ vesselDraftMeters: 8, waterDepthMeters: 8 }),
    ).toEqual({
      ok: true,
      output: { underKeelClearanceMeters: 0 },
    }));

  it("fails with negative_clearance when aground", () => {
    const result = runUnderKeelClearance({
      vesselDraftMeters: 9,
      waterDepthMeters: 8,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("negative_clearance");
  });

  it("grows clearance one metre per added metre of depth", () => {
    const before = calculateUnderKeelClearance({
      vesselDraftMeters: 5,
      waterDepthMeters: 10,
    });
    const after = calculateUnderKeelClearance({
      vesselDraftMeters: 5,
      waterDepthMeters: 11,
    });
    expect(after.underKeelClearanceMeters).toBe(
      before.underKeelClearanceMeters + 1,
    );
  });

  it("accepts zero depth and zero draft together", () =>
    expect(
      runUnderKeelClearance({ vesselDraftMeters: 0, waterDepthMeters: 0 }),
    ).toEqual({
      ok: true,
      output: { underKeelClearanceMeters: 0 },
    }));

  it("rejects non-finite and malformed input", () => {
    expect(
      runUnderKeelClearance({
        vesselDraftMeters: Number.NaN,
        waterDepthMeters: 12,
      }).ok,
    ).toBe(false);
    expect(
      runUnderKeelClearance({
        vesselDraftMeters: 8,
        waterDepthMeters: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing and malformed fields", () => {
    expect(runUnderKeelClearance({ waterDepthMeters: 12 }).ok).toBe(false);
    expect(
      runUnderKeelClearance({ vesselDraftMeters: "8", waterDepthMeters: 12 })
        .ok,
    ).toBe(false);
    expect(runUnderKeelClearance(null)).toMatchObject({ ok: false });
  });

  it("rejects unknown input fields", () =>
    expect(
      runUnderKeelClearance({
        extra: 1,
        vesselDraftMeters: 8,
        waterDepthMeters: 12,
      }).ok,
    ).toBe(false));
});
