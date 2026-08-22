import { describe, expect, it } from "vitest";
import {
  calculateMaxRangeAirspeed,
  maxRangeAirspeedExample,
  runMaxRangeAirspeed,
} from "./tool.js";

describe("max range airspeed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMaxRangeAirspeed(maxRangeAirspeedExample.input)).toEqual({
      ok: true,
      output: maxRangeAirspeedExample.output,
    });
  });

  it("equals sqrt(3) times the minimum sink speed", () => {
    expect(calculateMaxRangeAirspeed({ minimumSinkSpeedKt: 61.5 })).toEqual({
      maxRangeSpeedKt: 61.5 * Math.sqrt(3),
    });
    expect(calculateMaxRangeAirspeed({ minimumSinkSpeedKt: 45 })).toEqual({
      maxRangeSpeedKt: 45 * Math.sqrt(3),
    });
  });

  it("keeps raw results without rounding", () => {
    expect(calculateMaxRangeAirspeed({ minimumSinkSpeedKt: 0.01 })).toEqual({
      maxRangeSpeedKt: 0.01 * Math.sqrt(3),
    });
  });

  it("handles tiny minimum sink speeds", () => {
    expect(runMaxRangeAirspeed({ minimumSinkSpeedKt: 0.001 })).toEqual({
      ok: true,
      output: { maxRangeSpeedKt: 0.001 * Math.sqrt(3) },
    });
  });

  it("handles large minimum sink speeds", () => {
    expect(calculateMaxRangeAirspeed({ minimumSinkSpeedKt: 200 })).toEqual({
      maxRangeSpeedKt: 200 * Math.sqrt(3),
    });
  });

  it("exceeds the minimum sink speed by the sqrt(3) ratio", () => {
    const result =
      calculateMaxRangeAirspeed({ minimumSinkSpeedKt: 50 }).maxRangeSpeedKt /
      50;
    expect(result).toBe(Math.sqrt(3));
  });

  it("rejects zero through execution", () => {
    expect(runMaxRangeAirspeed({ minimumSinkSpeedKt: 0 }).ok).toBe(false);
  });

  it("rejects negative speeds through execution", () => {
    expect(runMaxRangeAirspeed({ minimumSinkSpeedKt: -40 }).ok).toBe(false);
  });

  it("reports a stable error code for invalid speeds", () => {
    const result = runMaxRangeAirspeed({ minimumSinkSpeedKt: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("scales linearly across the valid domain", () => {
    expect(
      calculateMaxRangeAirspeed({ minimumSinkSpeedKt: 100 }).maxRangeSpeedKt,
    ).toBe(
      2 * calculateMaxRangeAirspeed({ minimumSinkSpeedKt: 50 }).maxRangeSpeedKt,
    );
  });
});
