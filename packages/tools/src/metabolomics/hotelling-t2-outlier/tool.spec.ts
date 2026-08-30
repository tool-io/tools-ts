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
  it("uses covariance rather than a Euclidean PCA radius", () => {
    const output = calculate({
      pcOne: [2],
      pcTwo: [0],
      meanPcOne: 0,
      meanPcTwo: 0,
      covariance: [
        [4, 0],
        [0, 1],
      ],
      maximumT2: 1,
    });
    expect(output.tSquared).toEqual([1]);
    expect(output.outlierIndexes).toEqual([]);
  });
});
