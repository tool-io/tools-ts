import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  eulerianCircuitTestCaseExample as example,
  calculateEulerianCircuitTestCase,
} from "./tool.js";
describe("Random Eulerian Circuit Test Case Generator", () => {
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
  it("verifies the graph witness independently across seeds", () => {
    for (let seed = 0; seed < 12; seed += 1) {
      const result = calculateEulerianCircuitTestCase({
        ...example.input,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.nodes).toEqual([0, 1, 2, 3, 4]);
      expect(out.edges).toHaveLength(7);
      for (const [a, b] of out.edges) {
        expect(Number.isInteger(a)).toBe(true);
        expect(Number.isInteger(b)).toBe(true);
        expect(a).toBeGreaterThanOrEqual(0);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThan(5);
        expect(b).toBeLessThan(5);
      }
      expect(out.circuit).toHaveLength(8);
      expect(out.circuit[0]).toBe(out.circuit.at(-1));
      expect(new Set(out.circuit).size).toBe(5);
      const key = (a: number, b: number) =>
        a <= b ? `${a},${b}` : `${b},${a}`;
      const remaining = new Map<string, number>();
      for (const [a, b] of out.edges)
        remaining.set(key(a, b), (remaining.get(key(a, b)) ?? 0) + 1);
      for (let i = 1; i < out.circuit.length; i += 1) {
        const pair = key(out.circuit[i - 1], out.circuit[i]);
        expect(remaining.get(pair) ?? 0).toBeGreaterThan(0);
        remaining.set(pair, (remaining.get(pair) ?? 0) - 1);
      }
      expect([...remaining.values()].every((count) => count === 0)).toBe(true);
      expect(out.degrees.reduce((a, b) => a + b, 0)).toBe(14);
      out.degrees.forEach((degree) => expect(degree % 2).toBe(0));
    }
  });
  it("retains self-loops and parallel-edge identity", () => {
    expect(tool.execute({ nodeCount: 1, edgeCount: 3, seed: 42 })).toEqual({
      ok: true,
      output: {
        nodes: [0],
        edges: [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
        degrees: [6],
        circuit: [0, 0, 0, 0],
        randomness: { seed: 42, source: "seed" },
      },
    });
    expect(tool.execute({ ...example.input, edgeCount: 129 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "edgeCount" }] },
    });
  });
  it("is immutable and reproducible, and explicit seeds override context", () => {
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
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects impossible edge counts and malformed inputs with stable fields", () => {
    for (const edgeCount of [1, 4])
      expect(tool.execute({ ...example.input, edgeCount })).toMatchObject({
        ok: false,
        error: {
          issues: [{ code: "infeasible_edge_count", field: "edgeCount" }],
        },
      });
    expect(tool.execute({ ...example.input, nodeCount: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "nodeCount" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
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
  });
  it("rejects failing or invalid injected sources", () => {
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
