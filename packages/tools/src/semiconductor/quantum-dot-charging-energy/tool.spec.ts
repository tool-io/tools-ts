import { describe, expect, it } from "vitest";
import type { ToolResult } from "../../core/result.js";
import {
  calculateQuantumDotChargingEnergy,
  quantumDotChargingEnergyExample,
  runQuantumDotChargingEnergy,
} from "./tool.js";

const errorOf = <T>(result: ToolResult<T>) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the execution to fail.");
  return result.error;
};

describe("Quantum Dot Charging Energy Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runQuantumDotChargingEnergy(quantumDotChargingEnergyExample.input),
    ).toEqual({ ok: true, output: quantumDotChargingEnergyExample.output });
  });

  it("canonical example survives a JSON round trip", () => {
    const roundTrip = JSON.parse(
      JSON.stringify(quantumDotChargingEnergyExample),
    ) as typeof quantumDotChargingEnergyExample;
    expect(roundTrip).toEqual(quantumDotChargingEnergyExample);
  });

  it("uses a constant equal to half the elementary charge", () => {
    const e = 1.602176634e-19;
    expect(8.01088317e-20).toBe(e / 2);
  });

  it("doubles the charging energy when capacitance halves", () => {
    const atto = calculateQuantumDotChargingEnergy({
      totalCapacitanceFarads: 1e-18,
    }).chargingEnergyEv;
    expect(
      calculateQuantumDotChargingEnergy({ totalCapacitanceFarads: 5e-19 }),
    ).toEqual({ chargingEnergyEv: 2 * atto });
  });

  it("stays in the milli-electron-volt regime for typical femtofarad dots", () => {
    const energy = calculateQuantumDotChargingEnergy({
      totalCapacitanceFarads: 1e-15,
    }).chargingEnergyEv;
    expect(energy).toBeCloseTo(8.01088317e-5, 12);
  });

  it("rises sharply for attofarad-scale dots", () => {
    const energy = calculateQuantumDotChargingEnergy({
      totalCapacitanceFarads: 1e-20,
    }).chargingEnergyEv;
    expect(energy).toBeGreaterThan(1);
  });

  it("rejects zero and negative capacitance", () => {
    for (const bad of [0, -1e-18]) {
      const error = errorOf(
        runQuantumDotChargingEnergy({ totalCapacitanceFarads: bad }),
      );
      expect(error.code).toBe("invalid_input");
      expect(error.issues[0].code).toBe("invalid_field");
      expect(error.issues[0].field).toBe("totalCapacitanceFarads");
    }
  });

  it("rejects NaN through validation", () => {
    const error = errorOf(
      runQuantumDotChargingEnergy({
        totalCapacitanceFarads: Number.NaN,
      }),
    );
    expect(error.issues[0].code).toBe("invalid_field");
  });

  it("rejects missing required input", () => {
    const error = errorOf(runQuantumDotChargingEnergy({}));
    expect(error.code).toBe("invalid_input");
    expect(error.issues[0].field).toBe("totalCapacitanceFarads");
  });

  it("rejects unsupported input fields", () => {
    const error = errorOf(
      runQuantumDotChargingEnergy({
        capacitanceF: 1e-18,
        totalCapacitanceFarads: 1e-18,
      }),
    );
    expect(error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const error = errorOf(runQuantumDotChargingEnergy(undefined));
    expect(error.issues[0].code).toBe("object_required");
  });
});
