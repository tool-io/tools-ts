import { describe, expect, it } from "vitest";
import {
  calculatePowerSupplyInrushThermistor,
  powerSupplyInrushThermistorExample,
  runPowerSupplyInrushThermistor,
} from "./tool.js";

describe("Inrush With NTC", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPowerSupplyInrushThermistor(powerSupplyInrushThermistorExample.input),
    ).toEqual({
      ok: true,
      output: powerSupplyInrushThermistorExample.output,
    });
  });

  it("matches ohm's law for the series combination", () => {
    expect(
      calculatePowerSupplyInrushThermistor({
        busVolts: 120,
        loadResistanceOhms: 20,
        ntcColdOhms: 10,
      }).limitedInrushA,
    ).toBe(4);
  });

  it("reduces inrush as the cold resistance rises", () => {
    const small = calculatePowerSupplyInrushThermistor({
      busVolts: 340,
      loadResistanceOhms: 47,
      ntcColdOhms: 5,
    }).limitedInrushA;
    const large = calculatePowerSupplyInrushThermistor({
      busVolts: 340,
      loadResistanceOhms: 47,
      ntcColdOhms: 47,
    }).limitedInrushA;
    expect(large).toBeLessThan(small);
  });

  it("reports zero inrush on a zero bus", () => {
    expect(
      runPowerSupplyInrushThermistor({
        busVolts: 0,
        loadResistanceOhms: 47,
        ntcColdOhms: 10,
      }),
    ).toEqual({ ok: true, output: { limitedInrushA: 0 } });
  });

  it("rejects zero NTC resistance via invalid_resistance", () => {
    expect(
      runPowerSupplyInrushThermistor({
        busVolts: 340,
        loadResistanceOhms: 47,
        ntcColdOhms: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_resistance", field: "ntcColdOhms" }] },
      ok: false,
    });
  });

  it("rejects zero load resistance via invalid_resistance", () => {
    expect(
      runPowerSupplyInrushThermistor({
        busVolts: 340,
        loadResistanceOhms: 0,
        ntcColdOhms: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_resistance", field: "loadResistanceOhms" }],
      },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runPowerSupplyInrushThermistor({ busVolts: 340 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ntcColdOhms" }] },
      ok: false,
    });
  });
});
