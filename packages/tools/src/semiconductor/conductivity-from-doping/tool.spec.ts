import { describe, expect, it } from "vitest";
import {
  calculateConductivityFromDoping,
  conductivityFromDopingExample,
  runConductivityFromDoping,
} from "./tool.js";

describe("conductivity from doping calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runConductivityFromDoping(conductivityFromDopingExample.input),
    ).toEqual({ ok: true, output: conductivityFromDopingExample.output });
  });

  it("is the reciprocal of resistivity for the same doping", async () => {
    const { runResistivityFromDoping } = await import(
      "../resistivity-from-doping/tool.js"
    );
    const conductivity = calculateConductivityFromDoping({
      carrierType: "p",
      dopingConcentrationPerCm3: 1e15,
    });
    const resistivity = runResistivityFromDoping({
      carrierType: "p",
      dopingConcentrationPerCm3: 1e15,
    });
    if (!resistivity.ok) throw new Error("expected success");
    const ohmCm = (resistivity.output as { resistivityOhmCm: number })
      .resistivityOhmCm;
    expect(conductivity.conductivitySPerCm * ohmCm).toBeCloseTo(1, 9);
  });

  it("rejects non-positive doping through execution", () => {
    expect(
      runConductivityFromDoping({
        carrierType: "n",
        dopingConcentrationPerCm3: -5,
      }).ok,
    ).toBe(false);
  });
});
