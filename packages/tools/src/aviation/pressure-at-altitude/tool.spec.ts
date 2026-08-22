import { describe, expect, it } from "vitest";
import { pressureAtAltitudeExample, runPressureAtAltitude } from "./tool.js";

describe("pressure at altitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPressureAtAltitude(pressureAtAltitudeExample.input)).toEqual({
      ok: true,
      output: pressureAtAltitudeExample.output,
    });
  });

  it("returns sea-level pressure at zero altitude", () => {
    const r = runPressureAtAltitude({ altitudeFt: 0 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.pressureHpa).toBe(1013.25);
  });

  it("rejects negative altitudes through execution", () => {
    expect(runPressureAtAltitude({ altitudeFt: -1 }).ok).toBe(false);
  });

  it("rejects altitudes above the tropopause through execution", () => {
    expect(runPressureAtAltitude({ altitudeFt: 40000 })).toMatchObject({
      error: { issues: [{ code: "above_tropopause" }] },
      ok: false,
    });
  });
});
