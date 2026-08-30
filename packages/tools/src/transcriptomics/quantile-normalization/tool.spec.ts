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
  it("averages tied rank targets and restores original probe order", () => {
    expect(
      calculate({
        arrays: [
          [1, 1, 3],
          [2, 4, 6],
        ],
      }),
    ).toEqual({
      normalizedArrays: [
        [2, 2, 4.5],
        [1.5, 2.5, 4.5],
      ],
      rankMeans: [1.5, 2.5, 4.5],
    });
  });
});
