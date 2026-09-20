import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  minimumSpanningTreeTestCaseExample as example,
  calculateMinimumSpanningTreeTestCase,
} from "./tool.js";

describe("Random Minimum Spanning Tree Test Case Generator", () => {
  it("supports signed weights and preserves exact integer totals beyond the delegated display precision", () => {
    const negative = tool.execute({
      nodeCount: 3,
      edgeCount: 3,
      minimumWeight: -2,
      maximumWeight: -2,
      seed: 5,
    });
    if (!negative.ok) throw new Error("Expected success");
    expect(negative.output.totalWeight).toBe(-4);
    expect(matchesToolJsonSchema(negative.output, tool.outputSchema)).toBe(
      true,
    );
    const large = tool.execute({
      nodeCount: 3,
      edgeCount: 3,
      minimumWeight: 1_000_000_000_001,
      maximumWeight: 1_000_000_000_001,
      seed: 5,
    });
    if (!large.ok) throw new Error("Expected success");
    expect(large.output.totalWeight).toBe(2_000_000_000_002);
    expect(
      tool.execute({
        nodeCount: 3,
        edgeCount: 3,
        minimumWeight: Number.MAX_SAFE_INTEGER,
        maximumWeight: Number.MAX_SAFE_INTEGER,
        seed: 5,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "unsafe_weight_total", field: "maximumWeight" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        minimumWeight: -Number.MAX_SAFE_INTEGER,
        maximumWeight: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_weight_range", field: "maximumWeight" }],
      },
    });
  });
  it("matches the canonical example, schemas, and contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("independently verifies connectivity, exact size, weights, and model answers", () => {
    for (let seed = 0; seed < 12; seed += 1) {
      const result = calculateMinimumSpanningTreeTestCase({
        ...example.input,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.nodes).toEqual([0, 1, 2, 3, 4]);
      expect(out.edges).toHaveLength(6);
      const reached = new Set([0]),
        keys = new Set<string>();
      for (const [a, b, w] of out.edges) {
        expect(a).toBeLessThan(b);
        expect(w).toBeGreaterThanOrEqual(2);
        expect(w).toBeLessThanOrEqual(30);
        expect(Number.isInteger(w)).toBe(true);
        keys.add(`${a},${b}`);
      }
      expect(keys.size).toBe(6);
      for (let pass = 0; pass < 5; pass += 1)
        for (const [a, b] of out.edges) {
          if (reached.has(a)) reached.add(b);
          if (reached.has(b)) reached.add(a);
        }
      expect(reached.size).toBe(5);
      expect(out.treeEdges).toHaveLength(out.nodes.length - 1);
      let best = Infinity;
      // Enumerate every 4-edge subgraph, independently of Kruskal's greedy choice.
      for (let mask = 0; mask < 2 ** out.edges.length; mask += 1) {
        const chosen = out.edges.filter(
          (_, i) => Math.floor(mask / 2 ** i) % 2 === 1,
        );
        if (chosen.length !== 4) continue;
        const connected = new Set([0]);
        for (let pass = 0; pass < 5; pass += 1)
          for (const [a, b] of chosen) {
            if (connected.has(a)) connected.add(b);
            if (connected.has(b)) connected.add(a);
          }
        if (connected.size === 5)
          best = Math.min(
            best,
            chosen.reduce((sum, edge) => sum + edge[2], 0),
          );
      }
      expect(out.totalWeight).toBe(best);
      let selectedWeight = 0;
      for (const key of out.treeEdges) {
        const edge = out.edges.find(
          ([a, b]) => [String(a), String(b)].sort().join("|") === key,
        );
        if (!edge) throw new Error("Tree edge missing from generated graph");
        selectedWeight += edge[2];
      }
      expect(selectedWeight).toBe(best);
    }
  });
  it("preserves input, replays seeds, and gives explicit seeds priority", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
  });
  it("rejects infeasible counts and reversed weights with stable fields", () => {
    for (const edgeCount of [0, 3, 11])
      expect(tool.execute({ ...example.input, edgeCount })).toMatchObject({
        ok: false,
        error: {
          issues: [{ code: "infeasible_edge_count", field: "edgeCount" }],
        },
      });
    expect(tool.execute({ ...example.input, maximumWeight: 1 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_weight_range", field: "maximumWeight" }],
      },
    });
    for (const nodeCount of [0, 33, NaN, Infinity])
      expect(tool.execute({ ...example.input, nodeCount })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "nodeCount" }] },
      });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failure");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
});
