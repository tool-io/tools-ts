import { describe, expect, it } from "vitest";
import {
  adjacencyMatrixToListExample,
  calculateAdjacencyMatrixToList,
  runAdjacencyMatrixToList,
} from "./tool.js";

describe("graph adjacency matrix to list converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAdjacencyMatrixToList(adjacencyMatrixToListExample.input),
    ).toEqual({ ok: true, output: adjacencyMatrixToListExample.output });
  });

  it("uses provided node names in matrix order", () => {
    const output = calculateAdjacencyMatrixToList({
      matrix: [[0, 1, 0], [0, 0, 1], [1, 0, 0]],
      nodes: ["north", "east", "south"],
    });
    expect(output.table).toEqual({
      east: ["south"],
      north: ["east"],
      south: ["north"],
    });
  });

  it("rejects ragged, non-binary, and mismatched inputs through execution", () => {
    expect(runAdjacencyMatrixToList({ matrix: [[0, 1], [1]] })).toMatchObject({
      error: { issues: [{ code: "not_square" }] },
      ok: false,
    });
    expect(
      runAdjacencyMatrixToList({ matrix: [[0, 2], [2, 0]] }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_matrix_cell" }] },
      ok: false,
    });
    expect(
      runAdjacencyMatrixToList({
        matrix: [[0, 1], [1, 0]],
        nodes: ["only"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "node_count_mismatch" }] },
      ok: false,
    });
    expect(
      runAdjacencyMatrixToList({
        matrix: [[0, 1], [1, 0]],
        nodes: ["a", "a"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "duplicate_node" }] },
      ok: false,
    });
  });
});
