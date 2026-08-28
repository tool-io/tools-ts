import { describe, expect, it } from "vitest";
import { runParallelResonantImpedance } from "./tool.js";

const firstIssueCode = (
  result: ReturnType<typeof runParallelResonantImpedance>,
) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runParallelResonantImpedance>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Parallel Resonant Impedance", () => {
  it("computes the dynamic impedance of an LC tank", () =>
    expect(
      runParallelResonantImpedance({
        cFarads: 1e-9,
        lHenry: 0.001,
        windingResistanceOhms: 8,
      }),
    ).toEqual({ ok: true, output: { parallelImpedanceOhms: 125000 } }));
  it("computes the impedance for a 100pF tank", () =>
    expect(
      output(
        runParallelResonantImpedance({
          cFarads: 100e-12,
          lHenry: 1e-3,
          windingResistanceOhms: 50,
        }),
      ).parallelImpedanceOhms,
    ).toBeCloseTo(200000, 6));
  it("computes the impedance for a low-Q coil", () =>
    expect(
      output(
        runParallelResonantImpedance({
          cFarads: 1e-6,
          lHenry: 0.1,
          windingResistanceOhms: 10,
        }),
      ).parallelImpedanceOhms,
    ).toBeCloseTo(10000, 6));
  it("rejects a zero inductance", () => {
    const result = runParallelResonantImpedance({
      cFarads: 1e-9,
      lHenry: 0,
      windingResistanceOhms: 8,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a zero capacitance", () => {
    const result = runParallelResonantImpedance({
      cFarads: 0,
      lHenry: 0.001,
      windingResistanceOhms: 8,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a zero winding resistance", () => {
    const result = runParallelResonantImpedance({
      cFarads: 1e-9,
      lHenry: 0.001,
      windingResistanceOhms: 0,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative winding resistance", () =>
    expect(
      runParallelResonantImpedance({
        cFarads: 1e-9,
        lHenry: 0.001,
        windingResistanceOhms: -8,
      }).ok,
    ).toBe(false));
});
