import { describe, expect, it } from "vitest";
import {
  calculateIntrinsicCarrierConcentration,
  intrinsicCarrierConcentrationExample,
  runIntrinsicCarrierConcentration,
} from "./tool.js";

describe("intrinsic carrier concentration calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIntrinsicCarrierConcentration(intrinsicCarrierConcentrationExample.input),
    ).toEqual({ ok: true, output: intrinsicCarrierConcentrationExample.output });
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
});
