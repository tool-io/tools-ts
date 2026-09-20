import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cliqueInstanceExample as example,
  calculateCliqueInstance,
} from "./tool.js";

describe("Random Clique Instance Generator", () => {
  it("matches the canonical example and contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("independently verifies the planted graph property across seeds", () => {
    for (let seed = 0; seed < 12; seed += 1) {
      const result = calculateCliqueInstance({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      expect(result.output.nodes).toEqual([0, 1, 2, 3, 4]);
      expect(result.output.clique).toHaveLength(example.input.cliqueSize);
      const set = new Set(result.output.clique);
      expect(set.size).toBe(example.input.cliqueSize);
      const keys = new Set(result.output.edges.map(([a, b]) => `${a},${b}`));
      expect(keys.size).toBe(result.output.edges.length);
      for (const [a, b] of result.output.edges) {
        expect(a).toBeLessThan(b);
        expect(a).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThan(example.input.nodeCount);
      }
      for (const a of result.output.clique)
        for (const b of result.output.clique)
          if (a < b) expect(keys.has(`${a},${b}`)).toBe(true);
    }
  });
  it("preserves input and replays default or explicit seed deterministically", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
  });
  it("rejects impossible sets and invalid numeric fields specifically", () => {
    expect(tool.execute({ ...example.input, cliqueSize: 6 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "infeasible_set_size", field: "cliqueSize" }] },
    });
    for (const edgeProbability of [-1, 2, NaN, Infinity])
      expect(tool.execute({ ...example.input, edgeProbability })).toMatchObject(
        {
          ok: false,
          error: {
            issues: [{ code: "invalid_field", field: "edgeProbability" }],
          },
        },
      );
    expect(tool.execute({ ...example.input, nodeCount: 33 })).toMatchObject({
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
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: tool.inputSchema.required?.map((field) => ({
          code: "required_field",
          field,
        })),
      },
    });
  });
  it("validates every injected draw and keeps one advancing source", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.01, 1, NaN, Infinity])
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
    let calls = 0;
    const result = tool.execute(input, {
      random: () => {
        calls += 1;
        return calls === 2 ? 1 : 0;
      },
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
    expect(calls).toBe(2);
  });
});
