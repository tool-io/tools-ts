import { describe, expect, it } from "vitest";
import { stairRunLengthExample, runStairRunLength } from "./tool.js";

describe("Stair Run Length Calculator", () => {
  it("computes the canonical example", () =>
    expect(runStairRunLength(stairRunLengthExample.input)).toEqual({
      ok: true,
      output: { runLengthCm: 377 },
    }));

  it("counts one fewer tread than steps at the minimum step count", () =>
    expect(runStairRunLength({ stepCount: 2, treadDepthCm: 20 })).toEqual({
      ok: true,
      output: { runLengthCm: 20 },
    }));

  it("uses the maximum tread depth of 35 with two steps", () =>
    expect(runStairRunLength({ stepCount: 2, treadDepthCm: 35 })).toEqual({
      ok: true,
      output: { runLengthCm: 35 },
    }));

  it("multiplies the tread depth across ten treads", () =>
    expect(runStairRunLength({ stepCount: 11, treadDepthCm: 26 })).toEqual({
      ok: true,
      output: { runLengthCm: 260 },
    }));

  it("accepts fractional tread depths", () =>
    expect(runStairRunLength({ stepCount: 10, treadDepthCm: 27.5 })).toEqual({
      ok: true,
      output: { runLengthCm: 247.5 },
    }));

  it("computes a long flight of sixteen steps", () =>
    expect(runStairRunLength({ stepCount: 16, treadDepthCm: 24 })).toEqual({
      ok: true,
      output: { runLengthCm: 360 },
    }));

  it("rejects a single step", () =>
    expect(runStairRunLength({ stepCount: 1, treadDepthCm: 29 }).ok).toBe(
      false,
    ));

  it("rejects fractional step counts", () =>
    expect(runStairRunLength({ stepCount: 14.5, treadDepthCm: 29 }).ok).toBe(
      false,
    ));

  it("rejects tread depths below twenty centimeters", () =>
    expect(runStairRunLength({ stepCount: 14, treadDepthCm: 19.9 }).ok).toBe(
      false,
    ));

  it("rejects tread depths above thirty-five centimeters", () =>
    expect(runStairRunLength({ stepCount: 14, treadDepthCm: 35.1 }).ok).toBe(
      false,
    ));

  it("rejects a missing step count", () => {
    const result = runStairRunLength({ treadDepthCm: 29 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "stepCount",
        message: "Step count is invalid.",
      });
  });

  it("rejects unknown input fields", () => {
    const result = runStairRunLength({
      runLengthCm: 377,
      stepCount: 14,
      treadDepthCm: 29,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
