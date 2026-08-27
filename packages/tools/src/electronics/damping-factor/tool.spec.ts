import { describe, expect, it } from "vitest";
import { dampingFactorExample, runDampingFactor } from "./tool.js";

describe("Damping Factor", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runDampingFactor(dampingFactorExample.input)).toEqual({
      ok: true,
      output: dampingFactorExample.output,
    }));

  it("returns zeta of one at critical damping", () =>
    expect(
      runDampingFactor({
        capacitanceF: 0.0001,
        dampingResistanceOhms: 20,
        inductanceH: 0.01,
      }),
    ).toEqual({ ok: true, output: { dampingFactorZeta: 1 } }));

  it("returns zeta above one when over-damped", () =>
    expect(
      runDampingFactor({
        capacitanceF: 0.0001,
        dampingResistanceOhms: 40,
        inductanceH: 0.01,
      }),
    ).toEqual({ ok: true, output: { dampingFactorZeta: 2 } }));

  it("stays below one for the canonical under-damped circuit", () => {
    const result = runDampingFactor(dampingFactorExample.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.dampingFactorZeta).toBeLessThan(1);
  });

  it("rejects zero inductance", () =>
    expect(
      runDampingFactor({
        capacitanceF: 0.0001,
        dampingResistanceOhms: 2,
        inductanceH: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "inductanceH" }] },
      ok: false,
    }));

  it("rejects zero capacitance", () =>
    expect(
      runDampingFactor({
        capacitanceF: 0,
        dampingResistanceOhms: 2,
        inductanceH: 0.01,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "capacitanceF" }] },
      ok: false,
    }));

  it("rejects negative resistance", () =>
    expect(
      runDampingFactor({
        capacitanceF: 0.0001,
        dampingResistanceOhms: -2,
        inductanceH: 0.01,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "dampingResistanceOhms" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runDampingFactor({
        capacitanceF: 0.0001,
        dampingResistanceOhms: 2,
        extra: 1,
        inductanceH: 0.01,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
