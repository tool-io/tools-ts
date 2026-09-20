import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  knapsackInstanceExample as example,
  calculateKnapsackInstance,
} from "./tool.js";
const smallInput = {
  itemCount: 3,
  capacity: 4,
  minimumWeight: 2,
  maximumWeight: 2,
  minimumValue: 3,
  maximumValue: 3,
  seed: 42,
} as const;

describe("Random 0/1 Knapsack Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateKnapsackInstance(example.input)).toEqual({
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
  it("checks individual bounds, distinct 0/1 items, and the witness sums", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        itemCount: 30,
        capacity: 35,
        minimumWeight: 1,
        maximumWeight: 10,
        minimumValue: 0,
        maximumValue: 20,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output;
      expect(new Set(out.selected).size).toBe(out.selected.length);
      expect(out.items.map((item) => item.id)).toEqual(
        Array.from({ length: 30 }, (_, i) => i),
      );
      for (const item of out.items) {
        expect(item.weight).toBeGreaterThanOrEqual(1);
        expect(item.weight).toBeLessThanOrEqual(10);
        expect(item.value).toBeGreaterThanOrEqual(0);
        expect(item.value).toBeLessThanOrEqual(20);
      }
      const selected = out.items.filter((item) =>
        out.selected.includes(item.id),
      );
      expect(out.totalWeight).toBe(
        selected.reduce((s, item) => s + item.weight, 0),
      );
      expect(out.totalWeight).toBeLessThanOrEqual(35);
      expect(out.totalValue).toBe(
        selected.reduce((s, item) => s + item.value, 0),
      );
    }
  });
  it("rejects oversized items, reversed ranges and unsafe value totals", () => {
    expect(tool.execute({ ...smallInput, maximumWeight: 5 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumWeight" }] },
    });
    expect(tool.execute({ ...smallInput, minimumValue: 4 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumValue" }] },
    });
    expect(
      tool.execute({
        ...smallInput,
        minimumValue: Number.MAX_SAFE_INTEGER,
        maximumValue: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumValue", code: "unsafe_aggregate" }] },
    });
    const result = tool.execute({
      ...smallInput,
      minimumValue: 0,
      maximumValue: 0,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.totalValue).toBe(0);
  });
});
