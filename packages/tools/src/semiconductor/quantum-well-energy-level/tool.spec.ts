import { describe, expect, it } from "vitest";
import type { ToolResult } from "../../core/result.js";
import {
  calculateQuantumWellEnergyLevel,
  quantumWellEnergyLevelExample,
  runQuantumWellEnergyLevel,
} from "./tool.js";

const errorOf = <T>(result: ToolResult<T>) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the execution to fail.");
  return result.error;
};

describe("Quantum Well Energy Level Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runQuantumWellEnergyLevel(quantumWellEnergyLevelExample.input),
    ).toEqual({ ok: true, output: quantumWellEnergyLevelExample.output });
  });

  it("gives the free-electron ground state for a 1 nm well at n = 1", () => {
    expect(
      calculateQuantumWellEnergyLevel({ levelN: 1, wellWidthNm: 1 }),
    ).toEqual({ energyLevelEv: 0.3760301616440707 });
  });

  it("canonical example survives a JSON round trip", () => {
    const roundTrip = JSON.parse(
      JSON.stringify(quantumWellEnergyLevelExample),
    ) as typeof quantumWellEnergyLevelExample;
    expect(roundTrip).toEqual(quantumWellEnergyLevelExample);
  });

  it("scales with the square of the level index", () => {
    const first = calculateQuantumWellEnergyLevel({
      levelN: 1,
      wellWidthNm: 4,
    }).energyLevelEv;
    expect(
      calculateQuantumWellEnergyLevel({ levelN: 2, wellWidthNm: 4 }),
    ).toEqual({ energyLevelEv: 4 * first });
  });

  it("scales with the inverse square of the well width", () => {
    const narrow = calculateQuantumWellEnergyLevel({
      levelN: 1,
      wellWidthNm: 1,
    }).energyLevelEv;
    expect(
      calculateQuantumWellEnergyLevel({ levelN: 3, wellWidthNm: 2 })
        .energyLevelEv,
    ).toBeCloseTo((9 / 4) * narrow, 15);
  });

  it("uses the supplied effective mass", () => {
    expect(
      calculateQuantumWellEnergyLevel({
        effectiveMassRatio: 0.067,
        levelN: 1,
        wellWidthNm: 5,
      }),
    ).toEqual({ energyLevelEv: 0.22449561889198252 });
  });

  it("approaches zero for very wide wells", () => {
    const energy = calculateQuantumWellEnergyLevel({
      levelN: 1,
      wellWidthNm: 1000,
    }).energyLevelEv;
    expect(energy).toBeGreaterThan(0);
    expect(energy).toBeLessThan(0.001);
  });

  it("rejects non-positive well widths", () => {
    for (const width of [0, -5]) {
      const error = errorOf(
        runQuantumWellEnergyLevel({ levelN: 1, wellWidthNm: width }),
      );
      expect(error.code).toBe("invalid_input");
      expect(error.issues[0].code).toBe("invalid_value");
      expect(error.issues[0].field).toBe("wellWidthNm");
    }
  });

  it("rejects level indices below one", () => {
    for (const n of [0, -2]) {
      const error = errorOf(
        runQuantumWellEnergyLevel({ levelN: n, wellWidthNm: 5 }),
      );
      expect(error.issues[0].code).toBe("invalid_field");
    }
  });

  it("rejects fractional level indices through validation", () => {
    const error = errorOf(
      runQuantumWellEnergyLevel({ levelN: 1.5, wellWidthNm: 5 }),
    );
    expect(error.code).toBe("invalid_input");
    expect(error.issues[0].code).toBe("invalid_field");
    expect(error.issues[0].field).toBe("levelN");
  });

  it("rejects NaN and malformed inputs", () => {
    for (const bad of [
      { levelN: 1, wellWidthNm: Number.NaN },
      { levelN: 1, wellWidthNm: "wide" },
      { levelN: true, wellWidthNm: 5 },
    ]) {
      const error = errorOf(runQuantumWellEnergyLevel(bad));
      expect(error.code).toBe("invalid_input");
    }
  });

  it("rejects unsupported input fields", () => {
    const error = errorOf(
      runQuantumWellEnergyLevel({
        depthEv: 0.3,
        levelN: 1,
        wellWidthNm: 5,
      }),
    );
    expect(error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const error = errorOf(runQuantumWellEnergyLevel("well"));
    expect(error.issues[0].code).toBe("object_required");
  });
});
