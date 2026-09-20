import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  inventoryAbcClassificationDatasetExample as example,
  calculateInventoryAbcClassificationDataset,
} from "./tool.js";

describe("Random Inventory ABC Classification Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateInventoryAbcClassificationDataset(example.input)).toEqual({
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
  it("recomputes positive usage values and independent cumulative ranks from generated items", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const out = result.output;
    expect(out.items.reduce((s, item) => s + item.annualUsageValue, 0)).toBe(
      out.totalAnnualUsageValue,
    );
    const byId = new Map(out.items.map((item) => [item.id, item]));
    let cumulative = 0;
    for (const id of out.valueOrderIds) {
      const item = byId.get(id);
      if (!item) throw new Error("Every ranked ID must identify an item.");
      expect(item.annualUsageValue).toBe(item.demandUnits * item.unitValue);
      cumulative += item.annualUsageValue;
      expect(item.valueCumulativeSharePercent).toBe(
        (cumulative / out.totalAnnualUsageValue) * 100,
      );
    }
    const lastId = out.valueOrderIds.at(-1);
    if (lastId === undefined)
      throw new Error("A nonempty inventory needs a last rank.");
    expect(byId.get(lastId)?.valueCumulativeSharePercent).toBe(100);
  });
  it("retains stable ties and the core's end-cumulative single-item C classification", () => {
    const result = tool.execute({
      ...example.input,
      itemCount: 3,
      minimumDemand: 1,
      maximumDemand: 1,
      minimumUnitValue: 1,
      maximumUnitValue: 1,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        valueOrderIds: ["item-1", "item-2", "item-3"],
        throughputOrderIds: ["item-1", "item-2", "item-3"],
      },
    });
    expect(tool.execute({ ...example.input, itemCount: 1 })).toMatchObject({
      ok: true,
      output: {
        items: [
          {
            valueCumulativeSharePercent: 100,
            abcClass: "C",
            throughputCumulativeSharePercent: 100,
            velocityClass: "C",
          },
        ],
      },
    });
  });
  it("rejects unsafe item products/totals, zero workload and invalid policy boundaries", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumDemand: Number.MAX_SAFE_INTEGER,
        maximumDemand: Number.MAX_SAFE_INTEGER,
        minimumUnitValue: 2,
        maximumUnitValue: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_item_value" }] },
    });
    for (const change of [
      { minimumDemand: 0 },
      { minimumUnitValue: 6 },
      { fastBoundaryPercent: 90, slowBoundaryPercent: 90 },
      { itemCount: 129 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
