import { describe, expect, it } from "vitest";
import { mastRakeAngleExample, runMastRakeAngle } from "./tool.js";

describe("Mast Rake Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runMastRakeAngle(mastRakeAngleExample.input)).toEqual({
      ok: true,
      output: { rakeAngleDegrees: 0.5729386976834859 },
    });
  });

  it("returns zero degrees for zero rake", () => {
    expect(
      runMastRakeAngle({ referenceHeightMeters: 3, rakeMillimeters: 0 }),
    ).toEqual({ ok: true, output: { rakeAngleDegrees: 0 } });
  });

  it("accepts zero rake at the inclusive lower bound", () => {
    expect(
      runMastRakeAngle({ referenceHeightMeters: 4.5, rakeMillimeters: 0 }).ok,
    ).toBe(true);
  });

  it("scales inversely with reference height", () => {
    expect(
      runMastRakeAngle({ referenceHeightMeters: 3, rakeMillimeters: 100 }),
    ).toEqual({
      ok: true,
      output: { rakeAngleDegrees: 1.9091524329963763 },
    });
  });

  it("reaches about five point seven degrees for three hundred millimeters on a three meter boom", () => {
    expect(
      runMastRakeAngle({ referenceHeightMeters: 3, rakeMillimeters: 300 }),
    ).toEqual({
      ok: true,
      output: { rakeAngleDegrees: 5.710593137499643 },
    });
  });

  it("rejects a negative rake with a schema error", () => {
    expect(
      runMastRakeAngle({ referenceHeightMeters: 3, rakeMillimeters: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "rakeMillimeters" }] },
      ok: false,
    });
  });

  it("rejects zero reference height with a stable error", () => {
    expect(
      runMastRakeAngle({ referenceHeightMeters: 0, rakeMillimeters: 150 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_input", field: "referenceHeightMeters" }],
      },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runMastRakeAngle({
        referenceHeightMeters: 3,
        rakeMillimeters: 150,
        rakePercent: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "rakePercent" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runMastRakeAngle(null).ok).toBe(false);
    expect(runMastRakeAngle({}).ok).toBe(false);
  });
});
