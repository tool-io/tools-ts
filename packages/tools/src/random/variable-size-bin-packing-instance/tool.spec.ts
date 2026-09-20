import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  variableSizeBinPackingInstanceExample as example,
  calculateVariableSizeBinPackingInstance,
} from "./tool.js";
const smallInput = {
  itemCount: 3,
  minimumSize: 2,
  maximumSize: 2,
  binTypes: [
    { capacity: 3, cost: 2 },
    { capacity: 5, cost: 3 },
  ],
  seed: 42,
} as const;

describe("Random Variable-Size Bin Packing Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateVariableSizeBinPackingInstance(example.input)).toEqual({
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
  it("packs each item exactly once within its selected type's capacity", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        itemCount: 30,
        minimumSize: 1,
        maximumSize: 5,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        seen = out.bins.flatMap((bin) => bin.items);
      expect([...seen].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 30 }, (_, i) => i),
      );
      for (const bin of out.bins) {
        expect(bin.load).toBe(bin.items.reduce((s, i) => s + out.sizes[i], 0));
        expect(bin.load).toBeLessThanOrEqual(out.binTypes[bin.type].capacity);
      }
      expect(out.totalCost).toBe(
        out.bins.reduce((s, bin) => s + out.binTypes[bin.type].cost, 0),
      );
    }
  });
  it("reuses fitting bins and rejects impossible sizes and unsafe total costs", () => {
    const result = tool.execute({
      ...smallInput,
      binTypes: [{ capacity: 4, cost: 2 }],
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.bins.map((bin) => bin.items)).toEqual([[0, 1], [2]]);
    expect(tool.execute({ ...smallInput, maximumSize: 6 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumSize" }] },
    });
    expect(
      tool.execute({
        ...smallInput,
        binTypes: [{ capacity: 3, cost: Number.MAX_SAFE_INTEGER }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_aggregate" }] },
    });
    expect(tool.execute({ ...smallInput, binTypes: Array(2) })).toMatchObject({
      ok: false,
    });
  });
});
