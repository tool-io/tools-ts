import { describe, expect, it } from "vitest";
import {
  calculateTransformerCoreFluxDensity,
  transformerCoreFluxDensityExample,
  runTransformerCoreFluxDensity,
} from "./tool.js";

describe("transformer core flux density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTransformerCoreFluxDensity(transformerCoreFluxDensityExample.input),
    ).toEqual({ ok: true, output: transformerCoreFluxDensityExample.output });
  });

  it("lands near one tesla for a mains transformer", () => {
    const bTesla = calculateTransformerCoreFluxDensity({
      coreAreaCm2: 25,
      frequencyHz: 50,
      supplyVolts: 230,
      turnsInt: 400,
    }).fluxDensityTesla;
    expect(bTesla).toBeGreaterThan(0.8);
    expect(bTesla).toBeLessThan(1.4);
  });

  it("doubles when turns halve at fixed area and frequency", () => {
    const many = calculateTransformerCoreFluxDensity({
      coreAreaCm2: 4,
      frequencyHz: 60,
      supplyVolts: 12,
      turnsInt: 200,
    }).fluxDensityTesla;
    const few = calculateTransformerCoreFluxDensity({
      coreAreaCm2: 4,
      frequencyHz: 60,
      supplyVolts: 12,
      turnsInt: 100,
    }).fluxDensityTesla;
    expect(few).toBeCloseTo(many * 2, 12);
  });

  it("falls inversely with frequency and area", () => {
    const base = calculateTransformerCoreFluxDensity({
      coreAreaCm2: 4,
      frequencyHz: 60,
      supplyVolts: 12,
      turnsInt: 100,
    }).fluxDensityTesla;
    expect(base).toBeCloseTo(1.126126126126126, 15);
    expect(
      calculateTransformerCoreFluxDensity({
        coreAreaCm2: 4,
        frequencyHz: 120,
        supplyVolts: 12,
        turnsInt: 100,
      }).fluxDensityTesla,
    ).toBeCloseTo(base / 2, 15);
    expect(
      calculateTransformerCoreFluxDensity({
        coreAreaCm2: 8,
        frequencyHz: 60,
        supplyVolts: 12,
        turnsInt: 100,
      }).fluxDensityTesla,
    ).toBeCloseTo(base / 2, 15);
  });

  it("follows the documented four point four four transformer equation", () => {
    const coreAreaCm2 = 6.5;
    const frequencyHz = 400;
    const supplyVolts = 115;
    const turnsInt = 120;
    expect(
      calculateTransformerCoreFluxDensity({
        coreAreaCm2,
        frequencyHz,
        supplyVolts,
        turnsInt,
      }).fluxDensityTesla,
    ).toBeCloseTo(
      (supplyVolts * 1e4) / (4.44 * frequencyHz * coreAreaCm2 * turnsInt),
      15,
    );
  });

  it("rejects non-positive electrical inputs through execution", () => {
    expect(
      runTransformerCoreFluxDensity({
        coreAreaCm2: 25,
        frequencyHz: 50,
        supplyVolts: 0,
        turnsInt: 400,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "supplyVolts" }] },
      ok: false,
    });
    expect(
      runTransformerCoreFluxDensity({
        coreAreaCm2: 25,
        frequencyHz: -50,
        supplyVolts: 230,
        turnsInt: 400,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_frequency", field: "frequencyHz" }] },
      ok: false,
    });
    expect(
      runTransformerCoreFluxDensity({
        coreAreaCm2: 0,
        frequencyHz: 50,
        supplyVolts: 230,
        turnsInt: 400,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_area", field: "coreAreaCm2" }] },
      ok: false,
    });
  });

  it("rejects fewer than one turn through execution", () => {
    expect(
      runTransformerCoreFluxDensity({
        coreAreaCm2: 25,
        frequencyHz: 50,
        supplyVolts: 230,
        turnsInt: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_turns", field: "turnsInt" }] },
      ok: false,
    });
  });
});
