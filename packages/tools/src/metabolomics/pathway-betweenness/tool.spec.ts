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
  it("rejects asymmetric adjacency and gives zero betweenness to a triangle", () => {
    expect(
      tool.execute({
        nodeIds: ["a", "b", "c"],
        adjacency: [
          [0, 1, 0],
          [0, 0, 1],
          [0, 1, 0],
        ],
      }),
    ).toMatchObject({ ok: false });
    expect(
      calculate({
        nodeIds: ["a", "b", "c"],
        adjacency: [
          [0, 1, 1],
          [1, 0, 1],
          [1, 1, 0],
        ],
      }).betweenness,
    ).toEqual([0, 0, 0]);
  });
});
