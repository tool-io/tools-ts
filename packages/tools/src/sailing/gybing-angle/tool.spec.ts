import { describe, expect, it } from "vitest";
import { gybingAngleExample, runGybingAngle } from "./tool.js";

describe("gybing angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGybingAngle(gybingAngleExample.input)).toEqual({
      ok: true,
      output: gybingAngleExample.output,
    });
  });

  it("doubles the broad reaching angle", () => {
    const result = runGybingAngle({ broadReachingAngleDeg: 62 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gybingAngle).toBe(124);
  });

  it("accepts the inclusive lower boundary of ten degrees", () => {
    expect(runGybingAngle({ broadReachingAngleDeg: 10 })).toEqual({
      ok: true,
      output: { gybingAngle: 20 },
    });
  });

  it("accepts the inclusive upper boundary of eighty-five degrees", () => {
    expect(runGybingAngle({ broadReachingAngleDeg: 85 })).toEqual({
      ok: true,
      output: { gybingAngle: 170 },
    });
  });

  it("supports fractional broad reaching angles", () => {
    const result = runGybingAngle({ broadReachingAngleDeg: 67.5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gybingAngle).toBe(135);
  });

  it("rejects angles below ten degrees through validation", () => {
    for (const broadReachingAngleDeg of [5, 9.9])
      expect(runGybingAngle({ broadReachingAngleDeg })).toMatchObject({
        error: {
          issues: [{ code: "invalid_field", field: "broadReachingAngleDeg" }],
        },
        ok: false,
      });
  });

  it("rejects angles above eighty-five degrees through validation", () => {
    for (const broadReachingAngleDeg of [85.1, 100])
      expect(runGybingAngle({ broadReachingAngleDeg })).toMatchObject({
        error: {
          issues: [{ code: "invalid_field", field: "broadReachingAngleDeg" }],
        },
        ok: false,
      });
  });

  it("rejects missing and non-finite inputs", () => {
    expect(runGybingAngle({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "broadReachingAngleDeg" }],
      },
      ok: false,
    });
    expect(runGybingAngle({ broadReachingAngleDeg: Number.NaN }).ok).toBe(
      false,
    );
  });

  it("rejects unknown input fields", () => {
    expect(
      runGybingAngle({ broadReachingAngleDeg: 70, swellM: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "swellM" }] },
      ok: false,
    });
  });
});
