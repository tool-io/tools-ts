import { describe, expect, it } from "vitest";
import {
  cmpRemovalRateExample,
  runCmpRemovalRate,
  calculateCmpRemovalRate,
} from "./tool.js";

describe("CMP Preston Removal Rate Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCmpRemovalRate(cmpRemovalRateExample.input)).toEqual({
      ok: true,
      output: cmpRemovalRateExample.output,
    });
  });

  it("applies the default Preston coefficient when omitted", () => {
    expect(runCmpRemovalRate({ pressurePsi: 2, padSpeedRpm: 100 })).toEqual({
      ok: true,
      output: { removalNmPerMin: 4 },
    });
  });

  it("multiplies pressure and speed by an explicit coefficient", () => {
    expect(
      runCmpRemovalRate({
        pressurePsi: 3,
        padSpeedRpm: 60,
        prestonCoefficient: 0.02,
      }),
    ).toEqual({ ok: true, output: { removalNmPerMin: 3.5999999999999996 } });
  });

  it("scales linearly in both pressure and speed", () => {
    expect(runCmpRemovalRate({ pressurePsi: 10, padSpeedRpm: 40 })).toEqual({
      ok: true,
      output: { removalNmPerMin: 8 },
    });
    expect(
      runCmpRemovalRate({
        pressurePsi: 10,
        padSpeedRpm: 80,
        prestonCoefficient: 0.01,
      }),
    ).toEqual({ ok: true, output: { removalNmPerMin: 8 } });
  });

  it("accepts a zero Preston coefficient as a boundary", () => {
    expect(
      runCmpRemovalRate({
        pressurePsi: 5,
        padSpeedRpm: 40,
        prestonCoefficient: 0,
      }),
    ).toEqual({ ok: true, output: { removalNmPerMin: 0 } });
  });

  it("rejects zero polishing pressure via schema", () => {
    const result = runCmpRemovalRate({ pressurePsi: 0, padSpeedRpm: 40 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "pressurePsi",
      });
  });

  it("rejects negative pressure through schema validation", () => {
    const result = runCmpRemovalRate({ pressurePsi: -1, padSpeedRpm: 40 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "pressurePsi",
      });
  });

  it("rejects zero and negative pad speed via schema", () => {
    const zero = runCmpRemovalRate({ pressurePsi: 5, padSpeedRpm: 0 });
    const negative = runCmpRemovalRate({ pressurePsi: 5, padSpeedRpm: -40 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "padSpeedRpm",
      });
    expect(negative.ok).toBe(false);
    if (!negative.ok)
      expect(negative.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a negative Preston coefficient", () => {
    const result = runCmpRemovalRate({
      pressurePsi: 5,
      padSpeedRpm: 40,
      prestonCoefficient: -0.02,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "prestonCoefficient",
      });
  });

  it("rejects non-finite inputs", () => {
    const result = runCmpRemovalRate({
      pressurePsi: Number.POSITIVE_INFINITY,
      padSpeedRpm: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runCmpRemovalRate({
      pressurePsi: 5,
      padSpeedRpm: 40,
      platenRpm: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "platenRpm",
      });
  });

  it("rejects input that is not an object", () => {
    const result = runCmpRemovalRate(42);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("object_required");
  });

  it("direct calculation matches runner and property: removal ∝ pressure·speed", () => {
    const a = calculateCmpRemovalRate({
      pressurePsi: 5,
      padSpeedRpm: 40,
      prestonCoefficient: 0.02,
    }).removalNmPerMin;
    const b = calculateCmpRemovalRate({
      pressurePsi: 10,
      padSpeedRpm: 40,
      prestonCoefficient: 0.02,
    }).removalNmPerMin;
    expect(b).toBeCloseTo(a * 2, 12);
    expect(() =>
      calculateCmpRemovalRate({ pressurePsi: 0, padSpeedRpm: 40 }),
    ).toThrow();
    expect(() =>
      calculateCmpRemovalRate({
        pressurePsi: Number.NaN,
        padSpeedRpm: 40,
      }),
    ).toThrow();
  });
});
