import { describe, expect, it } from "vitest";
import {
  calculateTrueAirspeed,
  runTrueAirspeed,
  trueAirspeedExample,
} from "./tool.js";

describe("true airspeed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTrueAirspeed(trueAirspeedExample.input)).toEqual({
      ok: true,
      output: trueAirspeedExample.output,
    });
  });

  it("equals CAS at sea level and scales linearly with the factor", () => {
    expect(
      calculateTrueAirspeed({ altitudeFt: 0, casKt: 140 }),
    ).toEqual({ tasKt: 140 });
    expect(
      calculateTrueAirspeed({ altitudeFt: 10000, casKt: 100, factor: 0.03 })
        .tasKt,
    ).toBe(130);
  });

  it("rejects negative factors through execution", () => {
    expect(
      runTrueAirspeed({ altitudeFt: 0, casKt: 100, factor: -1 }).ok,
    ).toBe(false);
  });
});
