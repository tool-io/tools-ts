import { describe, expect, it } from "vitest";
import {
  calculateMinimumSpanningTree,
  minimumSpanningTreeExample,
  runMinimumSpanningTree,
} from "./tool.js";

describe("graph/minimum-spanning-tree", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMinimumSpanningTree(minimumSpanningTreeExample.input)).toEqual({
      ok: true,
      output: minimumSpanningTreeExample.output,
    });
  });

  it("skips heavier parallel edges and self-loops", () => {
    const result = calculateMinimumSpanningTree({
      graph: {
        edges: [
          ["a", "b", 5],
          ["b", "a", 1],
          ["a", "a", 0],
          ["b", "c", 2],
        ],
      },
    });
    expect(result.treeEdges).toEqual(["a|b", "b|c"]);
    expect(result.totalWeight).toBe(3);
    expect(result.componentCount).toBe(1);
  });

  it("yields a forest and counts components when disconnected", () => {
    const result = calculateMinimumSpanningTree({
      graph: {
        nodes: ["z"],
        edges: [
          ["a", "b", 4],
          ["c", "d", 6],
        ],
      },
    });
    expect(result.componentCount).toBe(3);
    expect(result.edgeCount).toBe(2);
    expect(result.totalWeight).toBe(10);
    expect(result.treeEdges).toEqual(["a|b", "c|d"]);
  });

  it("breaks weight ties deterministically by endpoint names", () => {
    const result = calculateMinimumSpanningTree({
      graph: {
        edges: [
          ["b", "a", 1],
          ["a", "c", 1],
        ],
      },
    });
    expect(result.treeEdges).toEqual(["a|c", "a|b"]);
  });

  it("rejects malformed graphs with structured errors", () => {
    const noEdges = runMinimumSpanningTree({ graph: { nodes: ["a"] } });
    expect(noEdges.ok).toBe(false);
    if (noEdges.ok) return;
    expect(noEdges.error.issues[0]?.code).toBe("invalid_graph");
    const badWeight = runMinimumSpanningTree({
      graph: { edges: [["a", "b", "heavy"]] },
    });
    expect(badWeight.ok).toBe(false);
    const empty = runMinimumSpanningTree({ graph: { edges: [] } });
    expect(empty.ok).toBe(false);
    if (empty.ok) return;
    expect(empty.error.issues[0]?.code).toBe("insufficient_nodes");
  });
});
