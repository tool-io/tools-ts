import { describe, expect, it } from "vitest";
import {
  calculateHbtEmitterInjectionEfficiency,
  hbtEmitterInjectionEfficiencyExample,
  runHbtEmitterInjectionEfficiency,
} from "./tool.js";

describe("Emitter Injection Efficiency Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHbtEmitterInjectionEfficiency(
        hbtEmitterInjectionEfficiencyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: hbtEmitterInjectionEfficiencyExample.output,
    });
  });

  it("returns the electron share of total emitter current", () => {
    expect(
      calculateHbtEmitterInjectionEfficiency({
        electronInjectionCurrentDensityAPerCm2: 3,
        holeBackInjectionCurrentDensityAPerCm2: 1,
      }),
    ).toEqual({ injectionEfficiency: 0.75 });
  });

  it("handles exact zero and unity boundaries", () => {
    expect(
      calculateHbtEmitterInjectionEfficiency({
        electronInjectionCurrentDensityAPerCm2: 0,
        holeBackInjectionCurrentDensityAPerCm2: 1,
      }).injectionEfficiency,
    ).toBe(0);
    expect(
      calculateHbtEmitterInjectionEfficiency({
        electronInjectionCurrentDensityAPerCm2: 1,
        holeBackInjectionCurrentDensityAPerCm2: 0,
      }).injectionEfficiency,
    ).toBe(1);
  });

  it("remains stable when one current is much larger", () => {
    expect(
      calculateHbtEmitterInjectionEfficiency({
        electronInjectionCurrentDensityAPerCm2: 1,
        holeBackInjectionCurrentDensityAPerCm2: 1e300,
      }).injectionEfficiency,
    ).toBe(1e-300);
  });

  it("rejects a zero total, negative currents, and missing inputs", () => {
    for (const input of [
      {
        electronInjectionCurrentDensityAPerCm2: 0,
        holeBackInjectionCurrentDensityAPerCm2: 0,
      },
      {
        electronInjectionCurrentDensityAPerCm2: -1,
        holeBackInjectionCurrentDensityAPerCm2: 1,
      },
      { electronInjectionCurrentDensityAPerCm2: 1 },
    ])
      expect(runHbtEmitterInjectionEfficiency(input).ok).toBe(false);
  });
});
