import { describe, expect, it } from "vitest";
import {
  calculateCabinPressureAltitude,
  cabinPressureAltitudeExample,
  runCabinPressureAltitude,
} from "./tool.js";

describe("cabin pressure altitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCabinPressureAltitude(cabinPressureAltitudeExample.input),
    ).toEqual({
      ok: true,
      output: cabinPressureAltitudeExample.output,
    });
  });

  it("matches ambient altitude with zero differential", () => {
    const result = runCabinPressureAltitude({
      cabinDeltaPsi: 0,
      pressureAltitudeFt: 8000,
    });
    if (!result.ok) throw new Error("expected success");
    const cabin = (result.output as { cabinAltitudeFt: number })
      .cabinAltitudeFt;
    expect(cabin).toBeCloseTo(8000, 4);
  });

  it("lowers the cabin altitude as the differential rises and rejects negatives", () => {
    const mildResult = runCabinPressureAltitude({
      cabinDeltaPsi: 1,
      pressureAltitudeFt: 20000,
    });
    const strongResult = runCabinPressureAltitude({
      cabinDeltaPsi: 5,
      pressureAltitudeFt: 20000,
    });
    if (!mildResult.ok || !strongResult.ok) throw new Error("expected success");
    const mild = mildResult.output.cabinAltitudeFt as number;
    const strong = strongResult.output.cabinAltitudeFt as number;
    expect(strong).toBeLessThan(mild);
    expect(
      runCabinPressureAltitude({ cabinDeltaPsi: -1, pressureAltitudeFt: 5000 })
        .ok,
    ).toBe(false);
  });
});
