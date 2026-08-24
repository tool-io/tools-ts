import { describe, expect, it } from "vitest";
import {
  runSpinQubitZeemanSplitting,
  spinQubitZeemanSplittingExample,
} from "./tool.js";

describe("spin-qubit Zeeman splitting", () => {
  it("reproduces the documented example", () =>
    expect(
      runSpinQubitZeemanSplitting(spinQubitZeemanSplittingExample.input),
    ).toEqual({ ok: true, output: spinQubitZeemanSplittingExample.output }));
  it("returns an energy magnitude for signed field and g factor", () => {
    const expected = { ok: true, output: { splittingMicroEv: 115.7676361332 } };
    expect(
      runSpinQubitZeemanSplitting({ gFactor: -2, magneticFieldTesla: 1 }),
    ).toEqual(expected);
    expect(
      runSpinQubitZeemanSplitting({ gFactor: 2, magneticFieldTesla: -1 }),
    ).toEqual(expected);
  });
  it("returns zero at zero field", () =>
    expect(runSpinQubitZeemanSplitting({ magneticFieldTesla: 0 })).toEqual({
      ok: true,
      output: { splittingMicroEv: 0 },
    }));
});
