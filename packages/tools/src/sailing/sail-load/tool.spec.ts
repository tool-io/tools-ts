import { describe, expect, it } from "vitest";
import { runSailLoad, sailLoadExample } from "./tool.js";

describe("sail load calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSailLoad(sailLoadExample.input)).toEqual({
      ok: true,
      output: sailLoadExample.output,
    });
  });

  it("scales with the square of wind speed", () => {
    expect(runSailLoad({ sailAreaM2: 20, windSpeedMs: 10 })).toEqual({
      ok: true,
      output: { sailLoadNewtons: 1470.0000000000002 },
    });
  });

  it("doubles the area to double the load", () => {
    const half = runSailLoad({ sailAreaM2: 30, windSpeedMs: 15 });
    const full = runSailLoad({ sailAreaM2: 60, windSpeedMs: 15 });
    expect(half.ok).toBe(true);
    expect(full.ok).toBe(true);
    if (half.ok && full.ok)
      expect(full.output.sailLoadNewtons as number).toBeCloseTo(
        (half.output.sailLoadNewtons as number) * 2,
        9,
      );
  });

  it("rejects zero wind speed with the stable code", () => {
    const result = runSailLoad({ sailAreaM2: 50, windSpeedMs: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("rejects zero sail area", () => {
    expect(runSailLoad({ sailAreaM2: 0, windSpeedMs: 10 }).ok).toBe(false);
  });

  it("rejects negative inputs", () => {
    expect(runSailLoad({ sailAreaM2: 50, windSpeedMs: -5 }).ok).toBe(false);
    expect(runSailLoad({ sailAreaM2: -50, windSpeedMs: 10 }).ok).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runSailLoad({ windSpeedMs: 10 }).ok).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(runSailLoad({ sailAreaM2: Number.NaN, windSpeedMs: 10 }).ok).toBe(
      false,
    );
  });

  it("computes a realistic storm load", () => {
    expect(runSailLoad({ sailAreaM2: 50, windSpeedMs: 20 })).toEqual({
      ok: true,
      output: { sailLoadNewtons: 14700.000000000002 },
    });
  });
});
