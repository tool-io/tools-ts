import { describe, expect, it } from "vitest";
import type { ToolResult } from "../../core/result.js";
import {
  calculateHeterojunction2degDensity,
  heterojunction2degDensityExample,
  runHeterojunction2degDensity,
} from "./tool.js";

const errorOf = <T>(result: ToolResult<T>) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the execution to fail.");
  return result.error;
};

describe("2DEG Density Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHeterojunction2degDensity(heterojunction2degDensityExample.input),
    ).toEqual({ ok: true, output: heterojunction2degDensityExample.output });
  });

  it("lands near 1e12 cm^-2 for a GaAs-like interface", () => {
    const density = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.3,
      separationNm: 30,
    }).sheetDensityPerCm2;
    expect(density).toBeGreaterThan(1e11);
    expect(density).toBeLessThan(1e13);
    expect(density).toBe(712883945354.055);
  });

  it("canonical example survives a JSON round trip", () => {
    const roundTrip = JSON.parse(
      JSON.stringify(heterojunction2degDensityExample),
    ) as typeof heterojunction2degDensityExample;
    expect(roundTrip).toEqual(heterojunction2degDensityExample);
  });

  it("defaults relative permittivity to 12.9", () => {
    const defaulted = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.25,
      separationNm: 20,
    });
    const explicit = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.25,
      relativePermittivity: 12.9,
      separationNm: 20,
    });
    expect(defaulted).toEqual(explicit);
  });

  it("scales linearly with the band offset", () => {
    const base = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.2,
      separationNm: 25,
    }).sheetDensityPerCm2;
    expect(
      calculateHeterojunction2degDensity({
        conductionBandOffsetEv: 0.4,
        separationNm: 25,
      }),
    ).toEqual({ sheetDensityPerCm2: 2 * base });
  });

  it("scales inversely with the donor-to-channel separation", () => {
    const close = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.3,
      separationNm: 15,
    }).sheetDensityPerCm2;
    const far = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.3,
      separationNm: 45,
    }).sheetDensityPerCm2;
    expect(close / far).toBeCloseTo(3, 9);
  });

  it("tracks a higher permittivity material proportionally", () => {
    const gaas = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.3,
      relativePermittivity: 11.7,
      separationNm: 30,
    }).sheetDensityPerCm2;
    const baseline = calculateHeterojunction2degDensity({
      conductionBandOffsetEv: 0.3,
      separationNm: 30,
    }).sheetDensityPerCm2;
    expect(gaas / baseline).toBeCloseTo(11.7 / 12.9, 12);
  });

  it("rejects non-positive offsets, separations, and permittivities", () => {
    for (const bad of [
      { conductionBandOffsetEv: 0, separationNm: 30 },
      { conductionBandOffsetEv: -0.2, separationNm: 30 },
      { conductionBandOffsetEv: 0.3, separationNm: 0 },
      {
        conductionBandOffsetEv: 0.3,
        relativePermittivity: -1,
        separationNm: 30,
      },
    ]) {
      const error = errorOf(runHeterojunction2degDensity(bad));
      expect(error.code).toBe("invalid_input");
      expect(error.issues[0].code).toBe("invalid_field");
    }
  });

  it("rejects NaN through validation", () => {
    const error = errorOf(
      runHeterojunction2degDensity({
        conductionBandOffsetEv: Number.NaN,
        separationNm: 30,
      }),
    );
    expect(error.issues[0].code).toBe("invalid_field");
  });

  it("rejects missing required inputs", () => {
    const error = errorOf(runHeterojunction2degDensity({ separationNm: 30 }));
    expect(error.code).toBe("invalid_input");
    expect(error.issues[0].field).toBe("conductionBandOffsetEv");
  });

  it("rejects unsupported input fields", () => {
    const error = errorOf(
      runHeterojunction2degDensity({
        conductionBandOffsetEv: 0.3,
        doping: 1e18,
        separationNm: 30,
      }),
    );
    expect(error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const error = errorOf(runHeterojunction2degDensity(true));
    expect(error.issues[0].code).toBe("object_required");
  });
});
