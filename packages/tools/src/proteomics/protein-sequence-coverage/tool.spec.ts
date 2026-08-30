import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
describe(tool.id, () => {
  it("counts overlapping peptide residues once", () => {
    expect(
      calculate({
        sequenceLength: 5,
        peptideStarts: [0, 2],
        peptideEnds: [3, 5],
      }),
    ).toEqual({ coveredResidues: 5, coveragePercent: 100 });
  });
  it("rejects fractional peptide coordinates", () => {
    expect(
      tool.execute({
        sequenceLength: 5,
        peptideStarts: [0],
        peptideEnds: [2.5],
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
