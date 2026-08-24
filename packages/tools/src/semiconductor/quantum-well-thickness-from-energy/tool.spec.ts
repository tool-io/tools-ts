import { describe, expect, it } from "vitest";
import {
  quantumWellThicknessFromEnergyExample,
  runQuantumWellThicknessFromEnergy,
} from "./tool.js";

describe("Quantum Well Thickness from Energy", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runQuantumWellThicknessFromEnergy(
        quantumWellThicknessFromEnergyExample.input,
      ),
    ).toEqual({ ok: true, output: { wellWidthNm: 0.6132129822859842 } }));

  it("scales with the square of the quantum number", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        levelN: 2,
        energyLevelEv: 0.5,
      }),
    ).toEqual({ ok: true, output: { wellWidthNm: 1.7344282323441826 } }));

  it("shrinks as transition energy grows", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        ...quantumWellThicknessFromEnergyExample.input,
        energyLevelEv: 4,
      }),
    ).toEqual({ ok: true, output: { wellWidthNm: 0.3066064911429921 } }));

  it("uses the supplied effective mass", () => {
    const result = runQuantumWellThicknessFromEnergy({
      effectiveMassRatio: 0.067,
      energyLevelEv: 0.22449561889198252,
      levelN: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.wellWidthNm).toBeCloseTo(5, 14);
  });

  it("doubles the width for twice the energy ratio at level three", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        levelN: 3,
        energyLevelEv: 2,
      }),
    ).toEqual({ ok: true, output: { wellWidthNm: 1.300821174258137 } }));

  it("rejects zero transition energy with a stable code", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        ...quantumWellThicknessFromEnergyExample.input,
        energyLevelEv: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_energy", field: "energyLevelEv" }],
      },
      ok: false,
    }));

  it("rejects negative transition energy with a stable code", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        ...quantumWellThicknessFromEnergyExample.input,
        energyLevelEv: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_energy", field: "energyLevelEv" }],
      },
      ok: false,
    }));

  it("rejects a zero quantum number with a stable code", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        ...quantumWellThicknessFromEnergyExample.input,
        levelN: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_level", field: "levelN" }] },
      ok: false,
    }));

  it("rejects a negative quantum number with a stable code", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        ...quantumWellThicknessFromEnergyExample.input,
        levelN: -2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_level", field: "levelN" }] },
      ok: false,
    }));

  it("rejects non-integer quantum numbers", () =>
    expect(
      runQuantumWellThicknessFromEnergy({
        ...quantumWellThicknessFromEnergyExample.input,
        levelN: 1.5,
      }).ok,
    ).toBe(false));

  it("rejects missing required inputs", () =>
    expect(runQuantumWellThicknessFromEnergy({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "levelN" }] },
      ok: false,
    }));
});
