import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateStronglyConnectedComponents,
  stronglyConnectedComponentsExample as example,
} from "./tool.js";

describe("strongly connected components", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("agrees with mutual transitive reachability for every three-vertex directed graph", () => {
    const possible: [number, number][] = Array.from({ length: 3 }, (_, a) =>
      Array.from({ length: 3 }, (_, b): [number, number] => [a, b]),
    ).flat();
    for (let mask = 0; mask < 512; mask += 1) {
      const edges = possible.filter(
        (_, i) => Math.floor(mask / 2 ** i) % 2 === 1,
      );
      const reachable = Array.from({ length: 3 }, (_, a) =>
        Array.from({ length: 3 }, (_, b) => a === b),
      );
      for (const [a, b] of edges) reachable[a][b] = true;
      for (let k = 0; k < 3; k += 1)
        for (let a = 0; a < 3; a += 1)
          for (let b = 0; b < 3; b += 1)
            reachable[a][b] ||= reachable[a][k] && reachable[k][b];
      const result = calculateStronglyConnectedComponents({
        nodeCount: 3,
        edges,
      });
      if (!result.ok) throw new Error("Expected success");
      expect(result.output.components.flat().sort((a, b) => a - b)).toEqual([
        0, 1, 2,
      ]);
      for (let a = 0; a < 3; a += 1)
        for (let b = 0; b < 3; b += 1)
          expect(
            result.output.membership[a] === result.output.membership[b],
          ).toBe(reachable[a][b] && reachable[b][a]);
      expect(result.output.componentCount).toBe(
        result.output.components.length,
      );
      for (const [a, b] of result.output.condensationEdges)
        expect(a).not.toBe(b);
    }
  });
  it("retains isolated vertices, accepts the empty graph, and handles a long cycle iteratively", () => {
    expect(tool.execute({ nodeCount: 3 })).toEqual({
      ok: true,
      output: {
        componentCount: 3,
        components: [[0], [1], [2]],
        condensationEdges: [],
        membership: [0, 1, 2],
      },
    });
    expect(tool.execute({ nodeCount: 0 })).toEqual({
      ok: true,
      output: {
        componentCount: 0,
        components: [],
        condensationEdges: [],
        membership: [],
      },
    });
    const edges = Array.from({ length: 512 }, (_, node) => [
      node,
      (node + 1) % 512,
    ]);
    const result = tool.execute({ nodeCount: 512, edges });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.componentCount).toBe(1);
    expect(result.output.components[0]).toHaveLength(512);
  });
  it("is immutable and independent of edge order or duplicate arcs", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    expect(
      tool.execute({ nodeCount: 7, edges: [...example.input.edges].reverse() }),
    ).toEqual({ ok: true, output: example.output });
    expect(
      tool.execute({
        nodeCount: 7,
        edges: [...example.input.edges, [0, 1], [2, 2]],
      }),
    ).toEqual({ ok: true, output: example.output });
  });
  it("reports invalid vertices and malformed or excessive input specifically", () => {
    expect(tool.execute({ nodeCount: 2, edges: [[0, 2]] })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_vertex", field: "edges.0" }] },
    });
    for (const edges of [
      [[0, 1, 2]],
      [[0, NaN]],
      [[0, Infinity]],
      Array(1),
      [[0, 1.5]],
      Array.from({ length: 4097 }, () => [0, 1]),
    ])
      expect(tool.execute({ nodeCount: 3, edges })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "edges" }] },
      });
    expect(tool.execute({ nodeCount: 513 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "nodeCount" }] },
    });
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: tool.inputSchema.required?.map((field) => ({
          code: "required_field",
          field,
        })),
      },
    });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    expect(tool.execute({ nodeCount: 2, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
  });
});
