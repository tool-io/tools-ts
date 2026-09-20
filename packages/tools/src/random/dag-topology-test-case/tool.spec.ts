import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  dagTopologyTestCaseExample as example,
  calculateDagTopologyTestCase,
} from "./tool.js";

describe("Random DAG Topology Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateDagTopologyTestCase(example.input)).toEqual({
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
  it("checks both orders and independently verifies there is no directed reachability cycle", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        reach = Array.from({ length: 5 }, () => Array<boolean>(5).fill(false));
      for (const order of [out.plantedOrder, out.topologicalOrder]) {
        expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
        for (const [a, b] of out.edges)
          expect(order.indexOf(a)).toBeLessThan(order.indexOf(b));
      }
      for (const [a, b] of out.edges) reach[a][b] = true;
      for (let k = 0; k < 5; k += 1)
        for (let i = 0; i < 5; i += 1)
          for (let j = 0; j < 5; j += 1)
            reach[i][j] ||= reach[i][k] && reach[k][j];
      for (let i = 0; i < 5; i += 1) expect(reach[i][i]).toBe(false);
      expect(out.hasCycle).toBe(false);
    }
  });
  it("retains isolated vertices and the existing string-label tie order", () => {
    const result = tool.execute({ nodeCount: 12, edgeCount: 0, seed: 42 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.topologicalOrder).toEqual([
      0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(result.output.edges).toEqual([]);
    expect(tool.execute({ ...example.input, edgeCount: 11 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "edgeCount", code: "infeasible_edge_count" }],
      },
    });
  });
});
