import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  shortestPathTestCaseExample as example,
  calculateShortestPathTestCase,
} from "./tool.js";

describe("Random Shortest Path Test Case Generator", () => {
  it("supports zero-weight ties and requires exact safe-integer distance outputs", () => {
    const zero = tool.execute({
      ...example.input,
      minimumWeight: 0,
      maximumWeight: 0,
    });
    if (!zero.ok) throw new Error("Expected success");
    expect(zero.output.distances).toEqual([0, 0, 0, 0, 0]);
    expect(zero.output.totalCost).toBe(0);
    const large = tool.execute({
      nodeCount: 3,
      edgeCount: 3,
      minimumWeight: Number.MAX_SAFE_INTEGER,
      maximumWeight: Number.MAX_SAFE_INTEGER,
      seed: 5,
    });
    if (!large.ok) throw new Error("Expected success");
    expect(large.output.totalCost).toBe(Number.MAX_SAFE_INTEGER);
    expect(
      tool.execute(
        {
          nodeCount: 3,
          edgeCount: 2,
          minimumWeight: Number.MAX_SAFE_INTEGER,
          maximumWeight: Number.MAX_SAFE_INTEGER,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "unsafe_distance_total", field: "maximumWeight" }],
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
      const result = calculateShortestPathTestCase({ ...example.input, seed });
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
      expect(out.start).not.toBe(out.end);
      expect(out.path[0]).toBe(out.start);
      expect(out.path.at(-1)).toBe(out.end);
      const distance = Array.from({ length: 5 }, (_, a) =>
        Array.from({ length: 5 }, (_, b) => (a === b ? 0 : Infinity)),
      );
      for (const [a, b, w] of out.edges) distance[a][b] = distance[b][a] = w;
      // Floyd-Warshall is independent of the delegated Dijkstra implementation.
      for (let k = 0; k < 5; k += 1)
        for (let a = 0; a < 5; a += 1)
          for (let b = 0; b < 5; b += 1)
            distance[a][b] = Math.min(
              distance[a][b],
              distance[a][k] + distance[k][b],
            );
      expect(out.distances).toEqual(distance[out.start]);
      expect(out.totalCost).toBe(distance[out.start][out.end]);
      let cost = 0;
      for (let i = 1; i < out.path.length; i += 1) {
        const edge = out.edges.find(
          ([a, b]) =>
            (a === out.path[i - 1] && b === out.path[i]) ||
            (b === out.path[i - 1] && a === out.path[i]),
        );
        if (!edge) throw new Error("Path edge missing from generated graph");
        cost += edge[2];
      }
      expect(cost).toBe(out.totalCost);
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
