import { describe, expect, it } from "vitest";
import {
  depthFirstTraversalExample,
  calculateDepthFirstTraversal,
  runDepthFirstTraversal,
} from "./tool.js";

describe("graph/depth-first-traversal", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDepthFirstTraversal(depthFirstTraversalExample.input)).toEqual({
      ok: true,
      output: depthFirstTraversalExample.output,
    });
  });

  it("descends into the smallest neighbor first", () => {
    const output = calculateDepthFirstTraversal({
      graph: { a: ["c", "b"], b: ["e"], c: ["d"], d: [], e: [] },
      start: "a",
    });
    expect(output).toEqual({
      depths: { a: 0, b: 1, c: 1, d: 2, e: 2 },
      visitOrder: ["a", "b", "e", "c", "d"],
    });
  });

  it("terminates on cyclic graphs without revisiting nodes", () => {
    const output = calculateDepthFirstTraversal({
      graph: { a: ["b"], b: ["c"], c: ["a"] },
      start: "a",
    });
    expect(output.visitOrder).toEqual(["a", "b", "c"]);
    expect(output.depths).toEqual({ a: 0, b: 1, c: 2 });
  });

  it("leaves unreachable nodes unvisited", () => {
    const output = calculateDepthFirstTraversal({
      graph: { a: [], orphan: [] },
      start: "a",
    });
    expect(output.visitOrder).toEqual(["a"]);
  });

  it("rejects a start node missing from the graph", () => {
    expect(runDepthFirstTraversal({ graph: {}, start: "a" })).toMatchObject({
      error: { issues: [{ code: "unknown_start" }] },
      ok: false,
    });
  });
});
