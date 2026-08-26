import { describe, expect, it } from "vitest";
import { chamferWidthExample, runChamferWidth } from "./tool.js";

describe("Chamfer Width Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runChamferWidth(chamferWidthExample.input)).toEqual({
      ok: true,
      output: chamferWidthExample.output,
    }));

  it("defaults to a 45 degree angle", () =>
    expect(runChamferWidth({ depthMm: 4 })).toEqual({
      ok: true,
      output: { chamferWidthMm: 3.9999999999999996 },
    }));

  it("calculates a shallow 30 degree chamfer", () =>
    expect(runChamferWidth({ angleDegrees: 30, depthMm: 10 })).toEqual({
      ok: true,
      output: { chamferWidthMm: 5.773502691896257 },
    }));

  it("calculates a steep 60 degree chamfer", () =>
    expect(runChamferWidth({ angleDegrees: 60, depthMm: 10 })).toEqual({
      ok: true,
      output: { chamferWidthMm: 17.320508075688767 },
    }));

  it("grows sharply near the vertical boundary", () =>
    expect(runChamferWidth({ angleDegrees: 89, depthMm: 1 })).toEqual({
      ok: true,
      output: { chamferWidthMm: 57.289961630759876 },
    }));

  it("accepts the minimum one degree angle", () =>
    expect(runChamferWidth({ angleDegrees: 1, depthMm: 100 })).toEqual({
      ok: true,
      output: { chamferWidthMm: 1.7455064928217585 },
    }));

  it("scales linearly with depth at a fixed angle", () =>
    expect(runChamferWidth({ angleDegrees: 45, depthMm: 8 })).toEqual({
      ok: true,
      output: { chamferWidthMm: 7.999999999999999 },
    }));

  it("rejects a zero or negative depth", () => {
    for (const depthMm of [0, -4]) {
      const result = runChamferWidth({ depthMm });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_depth");
    }
  });

  it("rejects angles outside the one to 89 degree range", () => {
    for (const angleDegrees of [0, 90]) {
      const result = runChamferWidth({ angleDegrees, depthMm: 4 });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_input");
    }
  });

  it("rejects non-finite input", () =>
    expect(runChamferWidth({ depthMm: Number.POSITIVE_INFINITY }).ok).toBe(
      false,
    ));

  it("rejects a missing depth", () => {
    const result = runChamferWidth({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () =>
    expect(runChamferWidth({ depthMm: 4, extra: 1 } as never).ok).toBe(false));
});
