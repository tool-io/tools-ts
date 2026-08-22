import { describe, expect, it } from "vitest";
import {
  calculateMaxEnduranceAirspeed,
  maxEnduranceAirspeedExample,
  runMaxEnduranceAirspeed,
} from "./tool.js";

describe("max endurance airspeed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMaxEnduranceAirspeed(maxEnduranceAirspeedExample.input)).toEqual({
      ok: true,
      output: maxEnduranceAirspeedExample.output,
    });
  });

  it("equals the minimum sink speed identically", () => {
    expect(calculateMaxEnduranceAirspeed({ minimumSinkSpeedKt: 45 })).toEqual({
      maxEnduranceSpeedKt: 45,
    });
    expect(calculateMaxEnduranceAirspeed({ minimumSinkSpeedKt: 61.5 })).toEqual(
      { maxEnduranceSpeedKt: 61.5 },
    );
  });

  it("keeps raw results without rounding", () => {
    expect(calculateMaxEnduranceAirspeed({ minimumSinkSpeedKt: 33.3 })).toEqual(
      { maxEnduranceSpeedKt: 33.3 },
    );
  });

  it("handles tiny minimum sink speeds", () => {
    expect(
      calculateMaxEnduranceAirspeed({ minimumSinkSpeedKt: 0.001 }),
    ).toEqual({
      maxEnduranceSpeedKt: 0.001,
    });
  });

  it("handles large minimum sink speeds", () => {
    expect(calculateMaxEnduranceAirspeed({ minimumSinkSpeedKt: 180 })).toEqual({
      maxEnduranceSpeedKt: 180,
    });
  });

  it("stays below the sqrt(3) max range speed for the same glider", () => {
    const minSink = calculateMaxEnduranceAirspeed({
      minimumSinkSpeedKt: 50,
    }).maxEnduranceSpeedKt;
    expect(minSink * Math.sqrt(3)).toBeGreaterThan(minSink);
  });

  it("rejects zero through execution", () => {
    expect(runMaxEnduranceAirspeed({ minimumSinkSpeedKt: 0 }).ok).toBe(false);
  });

  it("rejects negative speeds through execution", () => {
    expect(runMaxEnduranceAirspeed({ minimumSinkSpeedKt: -35 }).ok).toBe(false);
  });

  it("reports a stable error code for invalid speeds", () => {
    const result = runMaxEnduranceAirspeed({ minimumSinkSpeedKt: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("accepts fractional speeds just above zero", () => {
    expect(runMaxEnduranceAirspeed({ minimumSinkSpeedKt: 0.5 })).toEqual({
      ok: true,
      output: { maxEnduranceSpeedKt: 0.5 },
    });
  });
});
