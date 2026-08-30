import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";

describe(tool.id, () => {
  it("computes the canonical result", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("excludes genes with zero counts and rejects a zero-only matrix", () => {
    expect(
      calculate({
        geneCountsBySample: [
          [10, 20],
          [0, 50],
        ],
      }).usedGenes,
    ).toBe(1);
    expect(
      tool.execute({
        geneCountsBySample: [
          [0, 5],
          [10, 0],
        ],
      }),
    ).toMatchObject({ ok: false });
  });
});
