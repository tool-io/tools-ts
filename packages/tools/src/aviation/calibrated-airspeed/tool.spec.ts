import { describe, expect, it } from "vitest";
import { calibratedAirspeedExample, runCalibratedAirspeed } from "./tool.js";

describe("calibrated airspeed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCalibratedAirspeed(calibratedAirspeedExample.input)).toEqual({
      ok: true,
      output: calibratedAirspeedExample.output,
    });
  });

  it("equals TAS at sea level", () => {
    expect(runCalibratedAirspeed({ altitudeFt: 0, tasKt: 140 })).toEqual({
      ok: true,
      output: { casKt: 140 },
    });
  });

  it("round-trips with the true airspeed calculator", async () => {
    const { runTrueAirspeed } = await import("../true-airspeed/tool.js");
    const tas = 130;
    const forward = runCalibratedAirspeed({ altitudeFt: 5000, tasKt: tas });
    if (!forward.ok) throw new Error("expected success");
    const cas = (forward.output as { casKt: number }).casKt;
    const back = runTrueAirspeed({ altitudeFt: 5000, casKt: cas });
    if (!back.ok) throw new Error("expected success");
    expect((back.output as { tasKt: number }).tasKt).toBeCloseTo(tas, 9);
  });
});
