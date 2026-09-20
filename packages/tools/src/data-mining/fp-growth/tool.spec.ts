import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, { fpGrowthExample as example, calculateFpGrowth } from "./tool.js";

describe("FP-Growth Frequent Itemset Mining Tool", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFpGrowth(example.input)).toEqual({
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
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
  });
  it("matches independent exhaustive subset counting, including duplicate and empty transactions", () => {
    const labels = ["a", "b", "c", "d"],
      transactions = Array.from({ length: 16 }, (_, mask) =>
        labels.filter((_, i) => mask & (1 << i)),
      );
    transactions.push(["a", "a"], []);
    for (const minimumCount of [1, 3, 7, 18]) {
      const result = tool.execute({
        transactions,
        minimumCount,
        maximumSize: 4,
      });
      if (!result.ok) throw new Error("Expected success");
      const expected = new Map<string, number>();
      for (let mask = 1; mask < 16; mask += 1) {
        const subset = labels.filter((_, i) => mask & (1 << i));
        const count = transactions.filter((row) =>
          subset.every((label) => row.includes(label)),
        ).length;
        if (count >= minimumCount) expected.set(JSON.stringify(subset), count);
      }
      expect(
        new Map(
          result.output.frequentItemsets.map((set) => [
            JSON.stringify(set.items),
            set.count,
          ]),
        ),
      ).toEqual(expected);
      for (const set of result.output.frequentItemsets)
        expect(set.support).toBe(set.count / 18);
    }
  });
  it("avoids delimiter collisions, handles an empty tree, and enforces work/output limits", () => {
    const result = tool.execute({
      transactions: [["a", "b"], ["a\u0000b"]],
      minimumCount: 1,
      maximumSize: 2,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.frequentItemsets).toHaveLength(4);
    expect(
      tool.execute({ transactions: [[], []], minimumCount: 1, maximumSize: 3 }),
    ).toEqual({
      ok: true,
      output: {
        transactionCount: 2,
        initialTreeNodeCount: 0,
        frequentItemsets: [],
      },
    });
    expect(
      tool.execute({
        transactions: [
          Array.from({ length: 16 }, (_, i) => String(i)),
          ["extra"],
        ],
        minimumCount: 1,
        maximumSize: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "transactions", code: "resource_limit" }] },
    });
    expect(
      tool.execute({
        transactions: [Array.from({ length: 16 }, (_, i) => String(i))],
        minimumCount: 1,
        maximumSize: 16,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit" }] },
    });
    expect(
      tool.execute({ ...example.input, transactions: [Array(2)] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "transactions" }] },
    });
  });
});
