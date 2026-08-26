import { describe, expect, it } from "vitest";
import { runMembraneTimeConstant } from "./tool.js";

describe("Membrane Time Constant", () => {
  it("calculates a valid result", () =>
    expect(
      runMembraneTimeConstant({
        membraneCapacitanceUf: 2.5,
        membraneResistanceMohm: 4,
      }),
    ).toEqual({
      ok: true,
      output: { timeConstantMs: 10000 },
    }));
  it("converts megaohm-microfarads from seconds to milliseconds", () => {
    const result = runMembraneTimeConstant({
      membraneCapacitanceUf: 100,
      membraneResistanceMohm: 10,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.timeConstantMs).toBe(1000000);
  });
  it("handles fractional inputs", () => {
    const result = runMembraneTimeConstant({
      membraneCapacitanceUf: 0.5,
      membraneResistanceMohm: 8,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.timeConstantMs).toBeCloseTo(4000, 12);
  });
  it("doubles when resistance doubles", () => {
    const base = runMembraneTimeConstant({
      membraneCapacitanceUf: 1,
      membraneResistanceMohm: 5,
    });
    const doubled = runMembraneTimeConstant({
      membraneCapacitanceUf: 1,
      membraneResistanceMohm: 10,
    });
    expect(base.ok && doubled.ok).toBe(true);
    if (base.ok && doubled.ok)
      expect(
        Number(doubled.output.timeConstantMs) /
          Number(base.output.timeConstantMs),
      ).toBe(2);
  });
  it("rejects zero resistance", () =>
    expect(
      runMembraneTimeConstant({
        membraneCapacitanceUf: 1,
        membraneResistanceMohm: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero capacitance", () =>
    expect(
      runMembraneTimeConstant({
        membraneCapacitanceUf: 0,
        membraneResistanceMohm: 5,
      }).ok,
    ).toBe(false));
  it("rejects negative capacitance", () =>
    expect(
      runMembraneTimeConstant({
        membraneCapacitanceUf: -1,
        membraneResistanceMohm: 5,
      }).ok,
    ).toBe(false));
});
