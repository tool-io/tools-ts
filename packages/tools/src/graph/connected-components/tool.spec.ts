import { describe, expect, it } from "vitest";
import {
  calculateConnectedComponents,
  connectedComponentsExample,
  runConnectedComponents,
} from "./tool.js";

describe("connected components finder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runConnectedComponents(connectedComponentsExample.input),
    ).toEqual({ ok: true, output: connectedComponentsExample.output });
  });

  it("merges chains and ignores direction", () => {
    const output = calculateConnectedComponents({
      graph: { a: [], b: ["c"], c: [] },
    });
    expect(output.table).toEqual({
      componentCount: 2,
      components: [0, 1, 1],
      nodes: ["a", "b", "c"],
      sizes: [1, 2],
    });
  });

  it("treats every isolated node as its own component", () => {
    const output = calculateConnectedComponents({
      graph: { x: [], y: [], z: [] },
    });
    expect(output.table).toEqual({
      componentCount: 3,
      components: [0, 1, 2],
      nodes: ["x", "y", "z"],
      sizes: [1, 1, 1],
    });
  });

  it("rejects an empty graph through execution", () => {
    expect(runConnectedComponents({ graph: {} })).toMatchObject({
      error: { issues: [{ code: "insufficient_nodes" }] },
      ok: false,
    });
  });
});
