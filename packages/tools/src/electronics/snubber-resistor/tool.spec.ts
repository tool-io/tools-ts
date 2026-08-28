import { describe, expect, it } from "vitest";
import { runSnubberResistor, snubberResistorExample } from "./tool.js";

describe("Snubber Resistor Value", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSnubberResistor(snubberResistorExample.input)).toEqual({
      ok: true,
      output: snubberResistorExample.output,
    }));

  it("returns tau over C directly for unit capacitance", () =>
    expect(
      runSnubberResistor({ snubberCapacitanceNf: 1, timeConstantTargetNs: 50 }),
    ).toEqual({ ok: true, output: { snubberResistorOhms: 50 } }));

  it("yields one kilohm for 100 ns across 0.1 nF", () =>
    expect(
      runSnubberResistor({
        snubberCapacitanceNf: 0.1,
        timeConstantTargetNs: 100,
      }),
    ).toEqual({ ok: true, output: { snubberResistorOhms: 1000 } }));

  it("halves the resistance when the capacitance doubles", () => {
    const base = runSnubberResistor({
      snubberCapacitanceNf: 2.2,
      timeConstantTargetNs: 33,
    });
    const doubled = runSnubberResistor({
      snubberCapacitanceNf: 4.4,
      timeConstantTargetNs: 33,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.snubberResistorOhms).toBeCloseTo(
      Number(base.output.snubberResistorOhms) / 2,
      9,
    );
  });

  it("rejects a non-positive target time constant", () =>
    expect(
      runSnubberResistor({
        snubberCapacitanceNf: 0.47,
        timeConstantTargetNs: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_time", field: "timeConstantTargetNs" }],
      },
      ok: false,
    }));

  it("rejects a non-positive capacitance", () =>
    expect(
      runSnubberResistor({
        snubberCapacitanceNf: -0.47,
        timeConstantTargetNs: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_capacitance", field: "snubberCapacitanceNf" },
        ],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runSnubberResistor(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
