import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  graphColoringInstanceExample as example,
  calculateGraphColoringInstance,
} from "./tool.js";
describe("Random Graph Coloring Instance Generator", () => {
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
      const result = calculateGraphColoringInstance({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.nodes).toEqual([0, 1, 2, 3, 4]);
      expect(out.edges).toHaveLength(6);
      for (const [a, b] of out.edges) {
        expect(Number.isInteger(a)).toBe(true);
        expect(Number.isInteger(b)).toBe(true);
        expect(a).toBeGreaterThanOrEqual(0);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThan(5);
        expect(b).toBeLessThan(5);
      }
      expect(out.colors).toHaveLength(5);
      expect(new Set(out.colors).size).toBe(3);
      expect(out.colorCount).toBe(3);
      for (const [a, b] of out.edges)
        expect(out.colors[a]).not.toBe(out.colors[b]);
      const keys = new Set(out.edges.map(([a, b]) => `${a},${b}`));
      expect(keys.size).toBe(6);
    }
  });
  it("supports a one-color edgeless graph but rejects impossible color counts", () => {
    const result = tool.execute({
      nodeCount: 5,
      colorCount: 1,
      edgeCount: 0,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.edges).toEqual([]);
    expect(result.output.colors).toEqual([0, 0, 0, 0, 0]);
    expect(tool.execute({ ...example.input, colorCount: 6 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "infeasible_color_count", field: "colorCount" }],
      },
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
    for (const edgeCount of [9, 10])
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
