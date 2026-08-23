import { describe, expect, it } from "vitest";
import { calculateConductivityFromDoping } from "../conductivity-from-doping/tool.js";
import {
  calculateResistivityFromDoping,
  resistivityFromDopingExample,
  runResistivityFromDoping,
} from "./tool.js";

describe("resistivity from doping calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResistivityFromDoping(resistivityFromDopingExample.input),
    ).toEqual({ ok: true, output: resistivityFromDopingExample.output });
  });

  it("drops as doping rises", () => {
    const light = calculateResistivityFromDoping({
      carrierType: "n",
      dopingConcentrationPerCm3: 1e14,
    });
    const heavy = calculateResistivityFromDoping({
      carrierType: "n",
      dopingConcentrationPerCm3: 1e18,
    });
    expect(heavy.resistivityOhmCm).toBeLessThan(light.resistivityOhmCm);
  });

  it("rejects non-positive doping through execution", () => {
    expect(
      runResistivityFromDoping({
        carrierType: "p",
        dopingConcentrationPerCm3: 0,
      }).ok,
    ).toBe(false);
  });

  it("direct and reciprocal property", () => {
    const r = calculateResistivityFromDoping({
      carrierType: "n",
      dopingConcentrationPerCm3: 1e16,
    }).resistivityOhmCm;
    const c = calculateConductivityFromDoping({
      carrierType: "n",
      dopingConcentrationPerCm3: 1e16,
    }).conductivitySPerCm;
    expect(r * c).toBeCloseTo(1, 10);
    expect(() =>
      calculateResistivityFromDoping({
        carrierType: "n",
        dopingConcentrationPerCm3: -1,
      }),
    ).toThrow();
  });
});
