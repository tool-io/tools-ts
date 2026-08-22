import { describe, expect, it } from "vitest";
import {
  coldTemperatureCorrectionExample,
  runColdTemperatureCorrection,
} from "./tool.js";

describe("cold temperature correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runColdTemperatureCorrection(coldTemperatureCorrectionExample.input),
    ).toEqual({
      ok: true,
      output: coldTemperatureCorrectionExample.output,
    });
  });

  it("returns zero on an ISA day at any altitude", () => {
    const result = runColdTemperatureCorrection({
      indicatedAltitudeFt: 8000,
      oatC: 15 - 0.0019812 * 8000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.temperatureCorrectionFt).toBeCloseTo(0, 6);
    expect(
      runColdTemperatureCorrection({ indicatedAltitudeFt: 0, oatC: 15 }),
    ).toEqual({ ok: true, output: { temperatureCorrectionFt: 0 } });
  });

  it("is negative when colder than ISA", () => {
    const result = runColdTemperatureCorrection({
      indicatedAltitudeFt: 8000,
      oatC: -35,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.temperatureCorrectionFt).toBeLessThan(0);
    expect(result.output.temperatureCorrectionFt).toBeCloseTo(
      -4057.0675200000005,
      9,
    );
  });

  it("is positive when warmer than ISA", () => {
    const result = runColdTemperatureCorrection({
      indicatedAltitudeFt: 10000,
      oatC: 15,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.temperatureCorrectionFt).toBeGreaterThan(0);
    expect(result.output.temperatureCorrectionFt).toBeCloseTo(2353.6656, 9);
  });

  it("depends only on the deviation from ISA, not altitude alone", () => {
    const low = runColdTemperatureCorrection({
      indicatedAltitudeFt: 2000,
      oatC: 15 - 0.0019812 * 2000 - 25,
    });
    const high = runColdTemperatureCorrection({
      indicatedAltitudeFt: 4000,
      oatC: 15 - 0.0019812 * 4000 - 25,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(low.output.temperatureCorrectionFt).toBeCloseTo(-2970, 6);
    expect(high.output.temperatureCorrectionFt).toBeCloseTo(-2970, 6);
  });

  it("accepts sea level and the temperature extremes", () => {
    expect(
      runColdTemperatureCorrection({ indicatedAltitudeFt: 0, oatC: -80 }),
    ).toMatchObject({ ok: true });
    expect(
      runColdTemperatureCorrection({ indicatedAltitudeFt: 12000, oatC: 60 }),
    ).toMatchObject({ ok: true });
  });

  it("rejects negative altitudes", () => {
    expect(
      runColdTemperatureCorrection({ indicatedAltitudeFt: -500, oatC: -20 }),
    ).toMatchObject({ ok: false });
  });

  it("rejects temperatures outside the range", () => {
    expect(
      runColdTemperatureCorrection({ indicatedAltitudeFt: 5000, oatC: -81 }),
    ).toMatchObject({ ok: false });
    expect(
      runColdTemperatureCorrection({ indicatedAltitudeFt: 5000, oatC: 61 }),
    ).toMatchObject({ ok: false });
  });

  it("rejects missing inputs", () => {
    expect(runColdTemperatureCorrection({ oatC: -20 })).toMatchObject({
      ok: false,
    });
  });
});
