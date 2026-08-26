import { describe, expect, it } from "vitest";
import {
  calculateWindPressureOnSail,
  runWindPressureOnSail,
  windPressureOnSailExample,
} from "./tool.js";

describe("wind pressure on sail calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWindPressureOnSail(windPressureOnSailExample.input)).toEqual({
      ok: true,
      output: windPressureOnSailExample.output,
    });
  });

  it("applies the dynamic pressure formula", () => {
    expect(
      calculateWindPressureOnSail({
        liftCoefficient: 1.25,
        sailAreaM2: 14.3,
        windSpeedMs: 8.5,
      }),
    ).toEqual({
      sailForceNewtons: 0.5 * 1.225 * Math.pow(8.5, 2) * 14.3 * 1.25,
    });
  });

  it("defaults the lift coefficient to one", () => {
    expect(runWindPressureOnSail({ sailAreaM2: 20, windSpeedMs: 10 })).toEqual({
      ok: true,
      output: { sailForceNewtons: 0.5 * 1.225 * Math.pow(10, 2) * 20 * 1.0 },
    });
  });

  it("returns zero force at lift coefficient zero", () => {
    expect(
      runWindPressureOnSail({
        liftCoefficient: 0,
        sailAreaM2: 20,
        windSpeedMs: 10,
      }),
    ).toEqual({ ok: true, output: { sailForceNewtons: 0 } });
  });

  it("doubles force at lift coefficient two", () => {
    const base = calculateWindPressureOnSail({
      liftCoefficient: 1,
      sailAreaM2: 20,
      windSpeedMs: 10,
    }).sailForceNewtons;
    const doubled = calculateWindPressureOnSail({
      liftCoefficient: 2,
      sailAreaM2: 20,
      windSpeedMs: 10,
    }).sailForceNewtons;
    expect(doubled).toBe(2 * base);
  });

  it("accepts both lift coefficient bounds through execution", () => {
    for (const bound of [0, 2])
      expect(
        runWindPressureOnSail({
          liftCoefficient: bound,
          sailAreaM2: 15,
          windSpeedMs: 9,
        }).ok,
      ).toBe(true);
  });

  it("rejects out-of-range lift coefficients through execution", () => {
    for (const bad of [-0.5, 2.1])
      expect(
        runWindPressureOnSail({
          liftCoefficient: bad,
          sailAreaM2: 15,
          windSpeedMs: 9,
        }).ok,
      ).toBe(false);
  });

  it("rejects zero and negative wind speeds through execution", () => {
    for (const bad of [-6, 0])
      expect(
        runWindPressureOnSail({ sailAreaM2: 20, windSpeedMs: bad }).ok,
      ).toBe(false);
  });

  it("rejects non-positive sail areas through execution", () => {
    for (const bad of [-3, 0])
      expect(
        runWindPressureOnSail({ sailAreaM2: bad, windSpeedMs: 10 }).ok,
      ).toBe(false);
  });

  it("reports stable error codes for invalid inputs", () => {
    const windResult = runWindPressureOnSail({
      sailAreaM2: 20,
      windSpeedMs: 0,
    });
    expect(windResult.ok).toBe(false);
    if (!windResult.ok)
      expect(windResult.error.issues[0]?.code).toBe("invalid_wind");
    const areaResult = runWindPressureOnSail({
      sailAreaM2: 0,
      windSpeedMs: 10,
    });
    expect(areaResult.ok).toBe(false);
    if (!areaResult.ok)
      expect(areaResult.error.issues[0]?.code).toBe("invalid_area");
  });

  it("grows with the square of wind speed", () => {
    const low = calculateWindPressureOnSail({
      liftCoefficient: 1,
      sailAreaM2: 10,
      windSpeedMs: 5,
    }).sailForceNewtons;
    const high = calculateWindPressureOnSail({
      liftCoefficient: 1,
      sailAreaM2: 10,
      windSpeedMs: 10,
    }).sailForceNewtons;
    expect(high).toBe(4 * low);
  });

  it("handles very light air", () => {
    expect(
      calculateWindPressureOnSail({
        liftCoefficient: 1,
        sailAreaM2: 30,
        windSpeedMs: 0.1,
      }),
    ).toEqual({
      sailForceNewtons: 0.5 * 1.225 * Math.pow(0.1, 2) * 30 * 1,
    });
  });
});
