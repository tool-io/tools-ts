import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  hamiltonianCycleInstanceExample as example,
  calculateHamiltonianCycleInstance,
} from "./tool.js";
describe("Random Hamiltonian Cycle Instance Generator", () => {
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
      const result = calculateHamiltonianCycleInstance({
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
      expect(out.cycle).toHaveLength(6);
      expect(out.cycle[0]).toBe(out.cycle.at(-1));
      expect(new Set(out.cycle.slice(0, -1)).size).toBe(5);
      const keys = new Set(out.edges.map(([a, b]) => `${a},${b}`));
      expect(keys.size).toBe(out.edges.length);
      for (let i = 1; i < out.cycle.length; i += 1) {
        const [a, b] = [out.cycle[i - 1], out.cycle[i]].sort((a, b) => a - b);
        expect(keys.has(`${a},${b}`)).toBe(true);
      }
    }
  });
  it("supports the three-node boundary with exactly its three cycle edges", () => {
    const result = tool.execute({ nodeCount: 3, edgeCount: 3, seed: 42 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.edges).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
    expect(result.output.cycle).toHaveLength(4);
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
    for (const edgeCount of [4, 11])
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
