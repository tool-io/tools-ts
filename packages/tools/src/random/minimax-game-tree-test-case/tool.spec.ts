import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  minimaxGameTreeTestCaseExample as example,
  calculateMinimaxGameTreeTestCase,
} from "./tool.js";

describe("Random Minimax Game Tree Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMinimaxGameTreeTestCase(example.input)).toEqual({
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
  it("matches independent unpruned minimax over flat node references", () => {
    for (const maximizing of [true, false])
      for (let seed = 0; seed < 12; seed += 1) {
        const result = tool.execute({
          ...example.input,
          branchingFactor: 3,
          depth: 3,
          minimumLeafValue: -20,
          maximumLeafValue: 20,
          maximizing,
          seed,
        });
        expect(result.ok).toBe(true);
        if (!result.ok) continue;
        const nodes = new Map(
          result.output.nodes.map((node) => [node.id, node]),
        );
        const visit = (id: number, maximize: boolean): number => {
          const node = nodes.get(id);
          if (!node)
            throw new Error("Every tree reference needs a defined node.");
          return node.kind === "leaf"
            ? node.value
            : (maximize ? Math.max : Math.min)(
                ...node.children.map((child) => visit(child, !maximize)),
              );
        };
        expect(result.output.result.bestValue).toBe(
          visit(result.output.rootId, maximizing),
        );
        expect(result.output.leafCount).toBe(27);
        expect(result.output.nodes).toHaveLength(40);
        expect(result.output.result.evaluatedLeaves).toBeLessThanOrEqual(27);
        for (const node of result.output.nodes)
          if (node.kind === "branch")
            for (const child of node.children)
              expect(nodes.get(child)?.depth).toBe(node.depth + 1);
        expect(JSON.parse(result.output.treeJson)).toHaveProperty("children");
      }
  });
  it("supports a depth-zero root leaf and retains the explicit pruning control", () => {
    expect(tool.execute({ ...example.input, depth: 0 })).toMatchObject({
      ok: true,
      output: {
        leafCount: 1,
        nodes: [{ id: 0, depth: 0, kind: "leaf", value: 6 }],
        result: { bestValue: 6, evaluatedLeaves: 1, prunedBranches: 0 },
      },
    });
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: { result: { evaluatedLeaves: 3, prunedBranches: 1 } },
    });
  });
  it("rejects impossible utility ranges and excessive complete-tree work", () => {
    for (const change of [
      { minimumLeafValue: 10 },
      { branchingFactor: 1 },
      { depth: -1 },
      { depth: 8, branchingFactor: 6 },
      { depth: 9 },
      { maximumLeafValue: Infinity },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
