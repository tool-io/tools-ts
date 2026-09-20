import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  connectedGraphTestCaseExample as example,
  calculateConnectedGraphTestCase,
} from "./tool.js";

describe("Random Connected Graph Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateConnectedGraphTestCase(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
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
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("checks connectivity by independent repeated reachability and density from edge counts", () => {
    for (let seed = 0; seed < 16; seed += 1)
      for (const edgeCount of [4, 6, 10]) {
        const result = tool.execute({ ...example.input, edgeCount, seed });
        if (!result.ok) throw new Error("Expected success");
        const out = result.output,
          seen = new Set([0]);
        for (let pass = 0; pass < 5; pass += 1)
          for (const [a, b] of out.edges) {
            if (seen.has(a)) seen.add(b);
            if (seen.has(b)) seen.add(a);
          }
        expect(seen.size).toBe(5);
        expect(out.edges).toHaveLength(edgeCount);
        expect(new Set(out.edges.map((e) => e.join(","))).size).toBe(edgeCount);
        expect(out.componentCount).toBe(1);
        expect(out.density).toBeCloseTo(edgeCount / 10, 12);
      }
  });
  it("covers the two-node boundary and rejects incompatible edge counts", () => {
    const result = tool.execute({ nodeCount: 2, edgeCount: 1, seed: 42 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.edges).toEqual([[0, 1]]);
    expect(result.output.density).toBe(1);
    expect(tool.execute({ ...example.input, edgeCount: 3 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "edgeCount", code: "infeasible_edge_count" }],
      },
    });
    expect(tool.execute({ ...example.input, edgeCount: 11 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "edgeCount", code: "infeasible_edge_count" }],
      },
    });
  });
});
