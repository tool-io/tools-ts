import { describe, expect, it } from "vitest";
import {
  pressureAltitudeExample,
  runPressureAltitude,
} from "./tool.js";

describe("pressure altitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPressureAltitude(pressureAltitudeExample.input)).toEqual({
      ok: true,
      output: pressureAltitudeExample.output,
    });
  });

  it("returns the elevation under standard QNH", () => {
    expect(
      runPressureAltitude({ elevationFt: 0, qnhHpa: 1013.25 }),
    ).toEqual({ ok: true, output: { pressureAltitudeFt: 0 } });
  });

  it("raises pressure altitude when QNH drops below standard", () => {
    const low = runPressureAltitude({ elevationFt: 1000, qnhHpa: 980 });
    if (!low.ok) throw new Error("expected success");
    expect(low.output.pressureAltitudeFt).toBeGreaterThan(1000);
    const high = runPressureAltitude({ elevationFt: 1000, qnhHpa: 1040 });
    if (!high.ok) throw new Error("expected success");
    expect(high.output.pressureAltitudeFt).toBeLessThan(1000);
  });

  it("rejects non-positive QNH through execution", () => {
    expect(runPressureAltitude({ elevationFt: 0, qnhHpa: 0 }).ok).toBe(false);
  });
});
