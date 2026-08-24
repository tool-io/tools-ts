import { describe, expect, it } from "vitest";
import { quantumCapacitanceExample, runQuantumCapacitance } from "./tool.js";

describe("Quantum Capacitance Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runQuantumCapacitance(quantumCapacitanceExample.input)).toEqual({
      ok: true,
      output: quantumCapacitanceExample.output,
    }));

  it("doubles exactly with a doubled effective mass", () => {
    const base = runQuantumCapacitance({
      effectiveMassKg: 9.1093837015e-31,
    });
    if (!base.ok) throw new Error("expected success");
    const doubled = runQuantumCapacitance({
      effectiveMassKg: 2 * 9.1093837015e-31,
    });
    expect(doubled).toEqual({
      ok: true,
      output: {
        quantumCapacitanceFemtoFaradsPerUm2:
          2 * (base.output.quantumCapacitanceFemtoFaradsPerUm2 as number),
      },
    });
  });

  it("matches the GaAs conduction band mass", () =>
    expect(
      runQuantumCapacitance({ effectiveMassKg: 0.067 * 9.1093837015e-31 }),
    ).toEqual({
      ok: true,
      output: { quantumCapacitanceFemtoFaradsPerUm2: 44.841733314161935 },
    }));

  it("does not impose an arbitrary upper mass limit", () =>
    expect(runQuantumCapacitance({ effectiveMassKg: 3e-29 }).ok).toBe(true));

  it("accepts extremely light carriers", () =>
    expect(runQuantumCapacitance({ effectiveMassKg: 1e-35 }).ok).toBe(true));

  it("rejects zero mass through schema validation", () =>
    expect(runQuantumCapacitance({ effectiveMassKg: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects negative mass through schema validation", () =>
    expect(runQuantumCapacitance({ effectiveMassKg: -9e-31 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects non-finite mass", () =>
    expect(runQuantumCapacitance({ effectiveMassKg: Number.NaN }).ok).toBe(
      false,
    ));

  it("rejects a missing mass", () =>
    expect(runQuantumCapacitance({})).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));
});
