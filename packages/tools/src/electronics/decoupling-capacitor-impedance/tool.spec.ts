import { describe, expect, it } from "vitest";
import { runDecouplingCapacitorImpedance } from "./tool.js";
describe("Decap Impedance", () => {
  it("calculates impedance for one megahertz and one microfarad", () =>
    expect(
      runDecouplingCapacitorImpedance({ capacitanceUf: 1, frequencyMHz: 1 }),
    ).toEqual({
      ok: true,
      output: { impedanceMilliohms: 159.15494309189535 },
    }));
  it("halves when frequency doubles", () =>
    expect(
      runDecouplingCapacitorImpedance({ capacitanceUf: 1, frequencyMHz: 2 }),
    ).toEqual({
      ok: true,
      output: { impedanceMilliohms: 79.57747154594767 },
    }));
  it("inversely scales with capacitance", () =>
    expect(
      runDecouplingCapacitorImpedance({
        capacitanceUf: 0.1,
        frequencyMHz: 1,
      }),
    ).toEqual({
      ok: true,
      output: { impedanceMilliohms: 1591.5494309189535 },
    }));
  it("calculates a bulk capacitor case", () =>
    expect(
      runDecouplingCapacitorImpedance({
        capacitanceUf: 10,
        frequencyMHz: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: { impedanceMilliohms: 159.15494309189535 },
    }));
  it("rejects a zero frequency", () =>
    expect(
      runDecouplingCapacitorImpedance({ capacitanceUf: 1, frequencyMHz: 0 }).ok,
    ).toBe(false));
  it("rejects a negative capacitance", () =>
    expect(
      runDecouplingCapacitorImpedance({
        capacitanceUf: -1,
        frequencyMHz: 1,
      }).ok,
    ).toBe(false));
});
