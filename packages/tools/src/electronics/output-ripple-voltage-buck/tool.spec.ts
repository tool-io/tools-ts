import { describe, expect, it } from "vitest";
import {
  outputRippleVoltageBuckExample,
  runOutputRippleVoltageBuck,
} from "./tool.js";

describe("Output Ripple Buck", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runOutputRippleVoltageBuck(outputRippleVoltageBuckExample.input),
    ).toEqual({ ok: true, output: outputRippleVoltageBuckExample.output }));

  it("halves the ripple when the output capacitance doubles", () =>
    expect(
      runOutputRippleVoltageBuck({
        rippleCurrentA: 1,
        switchingFreqKhz: 100,
        outputCapacitanceUf: 200,
      }),
    ).toEqual({ ok: true, output: { outputRippleV: 0.00625 } }));

  it("halves the ripple when the switching frequency doubles", () => {
    const base = runOutputRippleVoltageBuck({
      rippleCurrentA: 2,
      switchingFreqKhz: 50,
      outputCapacitanceUf: 47,
    });
    const faster = runOutputRippleVoltageBuck({
      rippleCurrentA: 2,
      switchingFreqKhz: 100,
      outputCapacitanceUf: 47,
    });
    if (!base.ok || !faster.ok) throw new Error("expected success");
    expect(faster.output.outputRippleV).toBeCloseTo(
      Number(base.output.outputRippleV) / 2,
      15,
    );
  });

  it("scales linearly with the inductor ripple current", () => {
    const one = runOutputRippleVoltageBuck({
      rippleCurrentA: 1,
      switchingFreqKhz: 300,
      outputCapacitanceUf: 22,
    });
    const four = runOutputRippleVoltageBuck({
      rippleCurrentA: 4,
      switchingFreqKhz: 300,
      outputCapacitanceUf: 22,
    });
    if (!one.ok || !four.ok) throw new Error("expected success");
    expect(four.output.outputRippleV).toBeCloseTo(
      Number(one.output.outputRippleV) * 4,
      15,
    );
  });

  it("rejects a non-positive ripple current", () =>
    expect(
      runOutputRippleVoltageBuck({
        rippleCurrentA: 0,
        switchingFreqKhz: 100,
        outputCapacitanceUf: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "rippleCurrentA" }] },
      ok: false,
    }));

  it("rejects a non-positive frequency", () =>
    expect(
      runOutputRippleVoltageBuck({
        rippleCurrentA: 1,
        switchingFreqKhz: -100,
        outputCapacitanceUf: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_frequency", field: "switchingFreqKhz" }],
      },
      ok: false,
    }));

  it("rejects a non-positive output capacitance", () =>
    expect(
      runOutputRippleVoltageBuck({
        rippleCurrentA: 1,
        switchingFreqKhz: 100,
        outputCapacitanceUf: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_capacitance", field: "outputCapacitanceUf" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runOutputRippleVoltageBuck(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
