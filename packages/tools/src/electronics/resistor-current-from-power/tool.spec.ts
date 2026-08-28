import { describe, expect, it } from "vitest";
import {
  calculateResistorCurrentFromPower,
  resistorCurrentFromPowerExample,
  runResistorCurrentFromPower,
} from "./tool.js";

describe("resistor current from power rating", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResistorCurrentFromPower(resistorCurrentFromPowerExample.input),
    ).toEqual({ ok: true, output: resistorCurrentFromPowerExample.output });
  });

  it("returns milliamps from sqrt of watts over ohms", () => {
    expect(
      calculateResistorCurrentFromPower({ ratedWatts: 2, resistanceOhms: 200 })
        .maxSafeCurrentMa,
    ).toBe(100);
  });

  it("halves the safe current when resistance quadruples", () => {
    const low = calculateResistorCurrentFromPower({
      ratedWatts: 0.25,
      resistanceOhms: 50,
    }).maxSafeCurrentMa;
    const high = calculateResistorCurrentFromPower({
      ratedWatts: 0.25,
      resistanceOhms: 200,
    }).maxSafeCurrentMa;
    expect(high).toBeCloseTo(low / 2, 12);
  });

  it("scales with the square root of the rated power", () => {
    expect(
      calculateResistorCurrentFromPower({ ratedWatts: 1, resistanceOhms: 50 })
        .maxSafeCurrentMa,
    ).toBeCloseTo(Math.sqrt(1 / 50) * 1000, 15);
    expect(
      calculateResistorCurrentFromPower({ ratedWatts: 4, resistanceOhms: 50 })
        .maxSafeCurrentMa,
    ).toBeCloseTo(Math.sqrt(4 / 50) * 1000, 15);
  });

  it("rejects non-positive ratings through execution", () => {
    expect(
      runResistorCurrentFromPower({ ratedWatts: 0, resistanceOhms: 10 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "ratedWatts" }] },
      ok: false,
    });
    expect(
      runResistorCurrentFromPower({ ratedWatts: 1, resistanceOhms: -10 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_resistance", field: "resistanceOhms" }],
      },
      ok: false,
    });
  });

  it("keeps dissipation at the limit when drawing the reported current", () => {
    const input = { ratedWatts: 0.25, resistanceOhms: 100 };
    const ma = calculateResistorCurrentFromPower(input).maxSafeCurrentMa;
    const amps = ma / 1000;
    expect(amps ** 2 * input.resistanceOhms).toBeCloseTo(input.ratedWatts, 15);
  });
});
