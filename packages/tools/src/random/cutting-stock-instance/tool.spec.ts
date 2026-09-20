import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cuttingStockInstanceExample as example,
  calculateCuttingStockInstance,
} from "./tool.js";
const smallInput = {
  typeCount: 2,
  stockLength: 5,
  minimumLength: 2,
  maximumLength: 2,
  minimumDemand: 2,
  maximumDemand: 2,
  seed: 42,
} as const;

describe("Random One-Dimensional Cutting Stock Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCuttingStockInstance(example.input)).toEqual({
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
  it("fulfills every demand exactly and conserves each stock", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        typeCount: 8,
        stockLength: 20,
        minimumLength: 1,
        maximumLength: 20,
        minimumDemand: 1,
        maximumDemand: 5,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        counts = Array<number>(8).fill(0);
      expect(out.stockCount).toBe(out.stocks.length);
      for (const stock of out.stocks) {
        const used = stock.pieces.reduce((s, type) => {
          counts[type] += 1;
          return s + out.pieceTypes[type].length;
        }, 0);
        expect(stock.used).toBe(used);
        expect(stock.waste).toBe(20 - used);
        expect(stock.waste).toBeGreaterThanOrEqual(0);
      }
      expect(counts).toEqual(out.pieceTypes.map((piece) => piece.demand));
    }
  });
  it("guards sizes, demand work budget and reversed bounds", () => {
    expect(tool.execute({ ...smallInput, maximumLength: 6 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumLength" }] },
    });
    expect(
      tool.execute({ ...smallInput, typeCount: 32, maximumDemand: 64 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit" }] },
    });
    expect(tool.execute({ ...smallInput, minimumDemand: 3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumDemand" }] },
    });
  });
});
