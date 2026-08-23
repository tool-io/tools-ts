import { describe, expect, it } from "vitest";
import {
  dijkstraShortestPathExample,
  calculateDijkstraShortestPath,
  runDijkstraShortestPath,
} from "./tool.js";

describe("graph/dijkstra-shortest-path", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDijkstraShortestPath(dijkstraShortestPathExample.input)).toEqual({
      ok: true,
      output: dijkstraShortestPathExample.output,
    });
  });

  it("marks unreachable nodes with -1 and reports distances without end", () => {
    const result = runDijkstraShortestPath({
      nodeCount: 3,
      edges: [[0, 1, 5]],
      start: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.distances).toEqual([0, 5, -1]);
      expect(result.output.path).toEqual([]);
      expect(result.output.totalCost).toBe(-1);
    }
  });

  it("rejects empty graphs and invalid endpoints with structured errors", () => {
    const empty = runDijkstraShortestPath({ nodeCount: 0 });
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.error.issues[0]?.code).toBe("empty_graph");
    const badNode = runDijkstraShortestPath({ nodeCount: 2, start: 7 });
    expect(badNode.ok).toBe(false);
    if (!badNode.ok) expect(badNode.error.issues[0]?.code).toBe("invalid_node");
  });

  it("reports unreachable targets as not_found and rejects negative weights", () => {
    const unreachable = runDijkstraShortestPath({
      nodeCount: 3,
      edges: [[0, 1, 1]],
      start: 0,
      end: 2,
    });
    expect(unreachable.ok).toBe(false);
    if (!unreachable.ok)
      expect(unreachable.error.issues[0]?.code).toBe("not_found");
    const negative = runDijkstraShortestPath({
      nodeCount: 2,
      edges: [[0, 1, -2]],
    });
    expect(negative.ok).toBe(false);
    if (!negative.ok)
      expect(negative.error.issues[0]?.code).toBe("negative_weight");
  });

  it("prefers cheaper multi-hop routes over direct edges", () => {
    const result = runDijkstraShortestPath({
      nodeCount: 2,
      edges: [
        [0, 1, 10],
        [0, 1, 4],
      ],
      start: 0,
      end: 1,
    });
    expect(result.ok && result.output.totalCost).toBe(4);
  });

  it("exposes a pure calculate function", () => {
    expect(
      calculateDijkstraShortestPath(dijkstraShortestPathExample.input),
    ).toEqual(dijkstraShortestPathExample.output);
  });
});
