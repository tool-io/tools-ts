import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("computes the canonical example", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract", () =>
    expect(validateToolContract(tool)).toEqual([]));
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("flags a nonzero steady-state mass-balance residual", () => {
    expect(
      calculate({
        stoichiometry: [[1, -1]],
        fluxes: [1, 2],
        residualTolerance: 0,
      }),
    ).toEqual({
      reactionCount: 2,
      metaboliteCount: 1,
      residuals: [-1],
      balanced: false,
    });
  });
});
