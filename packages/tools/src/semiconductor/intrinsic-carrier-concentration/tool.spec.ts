import { describe, expect, it } from "vitest";
import {
  calculateIntrinsicCarrierConcentration,
  intrinsicCarrierConcentrationExample,
  runIntrinsicCarrierConcentration,
} from "./tool.js";

describe("intrinsic carrier concentration calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIntrinsicCarrierConcentration(
        intrinsicCarrierConcentrationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: intrinsicCarrierConcentrationExample.output,
    });
  });

  it("rises exponentially with temperature", () => {
    const cool = calculateIntrinsicCarrierConcentration({
      bandgapEv: 1.12,
      temperatureK: 250,
    });
    const hot = calculateIntrinsicCarrierConcentration({
      bandgapEv: 1.12,
      temperatureK: 350,
    });
    expect(hot.niPerCm3).toBeGreaterThan(cool.niPerCm3 * 10);
  });

  it("rejects invalid temperatures and gaps through execution", () => {
    for (const bad of [
      { bandgapEv: -1, temperatureK: 300 },
      { bandgapEv: 1.12, temperatureK: 0 },
    ])
      expect(runIntrinsicCarrierConcentration(bad).ok).toBe(false);
  });

  it("direct and monotonic with temperature", () => {
    const n1 = calculateIntrinsicCarrierConcentration({
      bandgapEv: 1.12,
      temperatureK: 300,
    }).niPerCm3;
    const n2 = calculateIntrinsicCarrierConcentration({
      bandgapEv: 1.12,
      temperatureK: 350,
    }).niPerCm3;
    expect(n2).toBeGreaterThan(n1);
    expect(() =>
      calculateIntrinsicCarrierConcentration({
        bandgapEv: -1,
        temperatureK: 300,
      }),
    ).toThrow();
    expect(() =>
      calculateIntrinsicCarrierConcentration({
        bandgapEv: 1.12,
        temperatureK: 0,
      }),
    ).toThrow();
  });

  it("does not overflow while taking the square root of large densities", () => {
    expect(
      calculateIntrinsicCarrierConcentration({
        bandgapEv: 1,
        ncPerCm3: 1e200,
        nvPerCm3: 1e200,
        temperatureK: 300,
      }).niPerCm3,
    ).toBeGreaterThan(0);
  });
});
