import { describe, expect, it } from "vitest";
import { massActionLawExample, runMassActionLaw } from "./tool.js";
import type { MassActionLawOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runMassActionLaw>,
): MassActionLawOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as MassActionLawOutput;
};

describe("Mass Action Law Check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMassActionLaw(massActionLawExample.input)).toEqual({
      ok: true,
      output: massActionLawExample.output,
    });
  });

  it("reports zero deviation when np equals ni squared exactly", () => {
    expect(
      runMassActionLaw({
        electronConc: 1e7,
        holeConc: 1e5,
        intrinsicConc: 1e6,
      }),
    ).toEqual({ ok: true, output: { deviationPercent: 0, product: 1e12 } });
  });

  it("reports zero deviation at thermal equilibrium", () => {
    expect(
      runMassActionLaw({
        electronConc: 5e15,
        holeConc: 2e4,
        intrinsicConc: 1e10,
      }),
    ).toEqual({ ok: true, output: { deviationPercent: 0, product: 1e20 } });
  });

  it("reports ninety-five percent for an under-doped product", () => {
    expect(
      runMassActionLaw({
        electronConc: 5e9,
        holeConc: 1e9,
        intrinsicConc: 1e10,
      }),
    ).toEqual({ ok: true, output: { deviationPercent: 95, product: 5e18 } });
  });

  it("is symmetric under swapping electron and hole concentrations", () => {
    const first = runMassActionLaw({
      electronConc: 1e16,
      holeConc: 2e4,
      intrinsicConc: 1e10,
    });
    const second = runMassActionLaw({
      electronConc: 2e4,
      holeConc: 1e16,
      intrinsicConc: 1e10,
    });
    expect(first).toEqual(second);
  });

  it("grows without bound as the product exceeds ni squared", () => {
    const output = outputOf(
      runMassActionLaw({
        electronConc: 1e14,
        holeConc: 1e14,
        intrinsicConc: 1e10,
      }),
    );
    expect(output.product).toBe(10000000000000000000000000000);
    expect(output.deviationPercent).toBe(9999999900);
  });

  it("scales linearly with multiplicative excess above equilibrium", () => {
    const tripled = outputOf(
      runMassActionLaw({
        electronConc: 3e10,
        holeConc: 1e10,
        intrinsicConc: 1e10,
      }),
    ).deviationPercent;
    const quadrupled = outputOf(
      runMassActionLaw({
        electronConc: 4e10,
        holeConc: 1e10,
        intrinsicConc: 1e10,
      }),
    ).deviationPercent;
    expect(tripled).toBe(200);
    expect(quadrupled).toBe(300);
  });

  it("rejects zero electron concentration", () => {
    const result = runMassActionLaw({
      electronConc: 0,
      holeConc: 1e10,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "electronConc",
      });
  });

  it("rejects zero hole concentration", () => {
    const result = runMassActionLaw({
      electronConc: 1e10,
      holeConc: 0,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "holeConc",
      });
  });

  it("rejects zero intrinsic concentration", () => {
    const result = runMassActionLaw({
      electronConc: 1e10,
      holeConc: 1e10,
      intrinsicConc: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "intrinsicConc",
      });
  });

  it("rejects negative concentrations through validation", () => {
    const result = runMassActionLaw({
      electronConc: 1e10,
      holeConc: -1,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "holeConc",
      });
  });

  it("rejects unknown input fields", () => {
    const result = runMassActionLaw({
      electronConc: 1e10,
      holeConc: 1e10,
      temperatureK: 300,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "temperatureK",
      });
  });
});
