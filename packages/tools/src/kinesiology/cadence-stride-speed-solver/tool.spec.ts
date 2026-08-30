import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("solves either of the other unknowns and rejects ambiguous inputs", () => {
    expect(
      calculate({ speedMps: 1.5, cadenceStepsPerMinute: 0, stepLengthM: 0.75 }),
    ).toEqual({ solvedField: "cadenceStepsPerMinute", solvedValue: 120 });
    expect(
      calculate({ speedMps: 1.5, cadenceStepsPerMinute: 120, stepLengthM: 0 }),
    ).toEqual({ solvedField: "stepLengthM", solvedValue: 0.75 });
    expect(
      tool.execute({
        speedMps: 1.5,
        cadenceStepsPerMinute: 120,
        stepLengthM: 0.75,
      }),
    ).toMatchObject({ ok: false, error: { code: "invalid_input" } });
  });
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
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
  });
});
