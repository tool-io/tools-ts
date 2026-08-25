import { describe, expect, it } from "vitest";
import { boomVangAngleExample, runBoomVangAngle } from "./tool.js";

describe("Vang Angle Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runBoomVangAngle(boomVangAngleExample.input)).toEqual({
      ok: true,
      output: { vangAngleDegrees: 53.13010235415598 },
    });
  });

  it("returns forty five degrees for equal height and distance", () => {
    expect(
      runBoomVangAngle({
        boomAttachmentDistanceMeters: 2,
        mastAttachmentHeightMeters: 2,
      }),
    ).toEqual({ ok: true, output: { vangAngleDegrees: 45 } });
  });

  it("computes the classic three four five geometry", () => {
    expect(
      runBoomVangAngle({
        boomAttachmentDistanceMeters: 4,
        mastAttachmentHeightMeters: 3,
      }),
    ).toEqual({ ok: true, output: { vangAngleDegrees: 36.86989764584402 } });
  });

  it("approaches ninety degrees as distance shrinks", () => {
    const result = runBoomVangAngle({
      boomAttachmentDistanceMeters: 0.01,
      mastAttachmentHeightMeters: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.vangAngleDegrees).toBeGreaterThan(89);
  });

  it("rejects zero mast attachment height with a stable error", () => {
    expect(
      runBoomVangAngle({
        boomAttachmentDistanceMeters: 1.5,
        mastAttachmentHeightMeters: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_input", field: "mastAttachmentHeightMeters" },
        ],
      },
      ok: false,
    });
  });

  it("rejects zero boom attachment distance with a stable error", () => {
    expect(
      runBoomVangAngle({
        boomAttachmentDistanceMeters: 0,
        mastAttachmentHeightMeters: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_input", field: "boomAttachmentDistanceMeters" },
        ],
      },
      ok: false,
    });
  });

  it("rejects negative distances", () => {
    expect(
      runBoomVangAngle({
        boomAttachmentDistanceMeters: -1,
        mastAttachmentHeightMeters: 2,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runBoomVangAngle({
        boomAttachmentDistanceMeters: 1.5,
        mastAttachmentHeightMeters: 2,
        vangLengthMeters: 3,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "vangLengthMeters" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runBoomVangAngle(null).ok).toBe(false);
    expect(runBoomVangAngle({}).ok).toBe(false);
  });
});
