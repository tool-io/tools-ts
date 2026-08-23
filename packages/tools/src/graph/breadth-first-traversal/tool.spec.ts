import { describe, expect, it } from "vitest";
import {
  breadthFirstTraversalExample,
  calculateBreadthFirstTraversal,
  runBreadthFirstTraversal,
} from "./tool.js";

describe("graph/breadth-first-traversal", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBreadthFirstTraversal(breadthFirstTraversalExample.input),
    ).toEqual({
      ok: true,
      output: breadthFirstTraversalExample.output,
    });
  });

  it("visits neighbors in ascending order regardless of listing order", () => {
    const output = calculateBreadthFirstTraversal({
      graph: { a: ["d", "c", "b"] },
      start: "a",
    });
    expect(output).toEqual({
      depths: { a: 0, b: 1, c: 1, d: 1 },
      visitOrder: ["a", "b", "c", "d"],
    });
  });

  it("stops at unreachable nodes", () => {
    const output = calculateBreadthFirstTraversal({
      graph: { a: ["b"], b: [], isolated: [] },
      start: "a",
    });
    expect(output.visitOrder).toEqual(["a", "b"]);
    expect(Object.keys(output.depths)).toEqual(["a", "b"]);
  });

  it("terminates on cyclic graphs", () => {
    const output = calculateBreadthFirstTraversal({
      graph: { a: ["b"], b: ["a"] },
      start: "a",
    });
    expect(output).toEqual({
      depths: { a: 0, b: 1 },
      visitOrder: ["a", "b"],
    });
  });

  it("rejects a start node missing from the graph", () => {
    expect(
      runBreadthFirstTraversal({ graph: { a: [] }, start: "zz" }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_start" }] },
      ok: false,
    });
  });
});
