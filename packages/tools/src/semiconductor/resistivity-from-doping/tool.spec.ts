import { describe, expect, it } from "vitest";
import {
  calculateResistivityFromDoping,
  resistivityFromDopingExample,
  runResistivityFromDoping,
} from "./tool.js";

describe("resistivity from doping calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runResistivityFromDoping(resistivityFromDopingExample.input)).toEqual(
      { ok: true, output: resistivityFromDopingExample.output },
    );
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
      runResistivityFromDoping({ carrierType: "p", dopingConcentrationPerCm3: 0 })
        .ok,
    ).toBe(false);
  });
});
