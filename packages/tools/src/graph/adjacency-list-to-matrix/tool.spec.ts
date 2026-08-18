import { describe, expect, it } from "vitest";
import {
  adjacencyListToMatrixExample,
  calculateAdjacencyListToMatrix,
  runAdjacencyListToMatrix,
} from "./tool.js";

describe("graph adjacency list to matrix converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAdjacencyListToMatrix(adjacencyListToMatrixExample.input),
    ).toEqual({ ok: true, output: adjacencyListToMatrixExample.output });
  });

  it("mirrors edges for undirected graphs", () => {
    const output = calculateAdjacencyListToMatrix({
      directed: false,
      graph: { a: ["b"], b: [] },
    });
    expect(output.table).toEqual({
      matrix: [[0, 1], [1, 0]],
      nodes: ["a", "b"],
    });
  });

  it("marks self-loops on the diagonal and adopts implicit nodes", () => {
    const output = calculateAdjacencyListToMatrix({
      directed: false,
      graph: { a: ["a", "z"] },
    });
    expect(output.table.nodes).toEqual(["a", "z"]);
    expect(output.table.matrix).toEqual([[1, 1], [1, 0]]);
  });

  it("rejects empty graphs through execution", () => {
    expect(runAdjacencyListToMatrix({ graph: {} })).toMatchObject({
      error: { issues: [{ code: "insufficient_nodes" }] },
      ok: false,
    });
  });
});
