import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  itemsetInstanceExample as example,
  calculateItemsetInstance,
} from "./tool.js";

describe("Random Transaction Itemset Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateItemsetInstance(example.input)).toEqual({
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
  it("checks subset uniqueness, bounds and transaction presence counts independently", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...example.input,
        transactionCount: 30,
        minimumSize: 0,
        maximumSize: 4,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(out.transactions).toHaveLength(30);
      for (const row of out.transactions) {
        expect(new Set(row).size).toBe(row.length);
        expect(row.length).toBeLessThanOrEqual(4);
        for (const item of row) expect(out.items).toContain(item);
      }
      expect(out.itemCounts).toEqual(
        out.items.map((item) =>
          out.transactions.reduce(
            (sum, row) => sum + Number(row.includes(item)),
            0,
          ),
        ),
      );
    }
  });
  it("supports empty/full transactions and prototype-shaped item names without collisions", () => {
    for (const size of [0, 3]) {
      const result = tool.execute({
        items: ["__proto__", "constructor", "toString"],
        transactionCount: 2,
        minimumSize: size,
        maximumSize: size,
        seed: 42,
      });
      if (!result.ok) throw new Error("Expected success");
      expect(
        result.output.transactions.every((row) => row.length === size),
      ).toBe(true);
      expect(result.output.itemCounts).toEqual(size ? [2, 2, 2] : [0, 0, 0]);
    }
    expect(tool.execute({ ...example.input, items: ["a", "a"] })).toMatchObject(
      {
        ok: false,
        error: { issues: [{ field: "items", code: "duplicate_items" }] },
      },
    );
    expect(tool.execute({ ...example.input, maximumSize: 5 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumSize" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        items: Array.from({ length: 64 }, (_, i) => String(i)),
        transactionCount: 512,
        maximumSize: 64,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "transactionCount", code: "resource_limit" }],
      },
    });
  });
});
