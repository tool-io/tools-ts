import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  warehouseOrderFulfillmentDatasetExample as example,
  calculateWarehouseOrderFulfillmentDataset,
} from "./tool.js";

describe("Random Warehouse Order Fulfillment Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateWarehouseOrderFulfillmentDataset(example.input)).toEqual({
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
  it("reconstructs totals and keeps shipped quantities within each real generated line", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const lines = result.output.orders.flatMap((order) => order.lines);
    expect(result.output.totals.unitsOrdered).toBe(
      lines.reduce((s, l) => s + l.orderedUnits, 0),
    );
    expect(result.output.totals.unitsShipped).toBe(
      lines.reduce((s, l) => s + l.shippedUnits, 0),
    );
    for (const order of result.output.orders) {
      expect(order.delivered).toBe(order.lines.some((l) => l.shippedUnits > 0));
      expect(order.onTimeInFull).toBe(
        order.lines.every((l) => l.shippedUnits === l.orderedUnits && l.onTime),
      );
      order.lines.forEach((l) => {
        expect(l.shippedUnits).toBeGreaterThanOrEqual(0);
        expect(l.shippedUnits).toBeLessThanOrEqual(l.orderedUnits);
      });
    }
    expect(
      result.output.metrics.fillRatePercent +
        result.output.metrics.backorderRatePercent,
    ).toBeCloseTo(100);
  });
  it("retains no-delivery and all-complete endpoint datasets with explicit OTIF semantics", () => {
    const input = {
      ...example.input,
      orderCount: 1,
      minimumLines: 1,
      maximumLines: 1,
      minimumUnits: 1,
      maximumUnits: 1,
      onTimeProbability: 1,
    };
    const { seed, ...unseeded } = input;
    expect(tool.execute(unseeded, { random: () => 0 })).toMatchObject({
      ok: true,
      output: {
        totals: { ordersDelivered: 0 },
        metrics: {
          fillRatePercent: 0,
          backorderRatePercent: 100,
          otifPercent: null,
          otifUndefinedReason: "no-delivered-orders",
        },
      },
    });
    expect(tool.execute(unseeded, { random: () => 0.99 })).toMatchObject({
      ok: true,
      output: {
        metrics: {
          fillRatePercent: 100,
          backorderRatePercent: 0,
          otifPercent: 100,
          otifUndefinedReason: null,
        },
      },
    });
  });
  it("rejects unsafe aggregates, unsafe inclusive cardinality and invalid bounds", () => {
    expect(
      tool.execute({
        ...example.input,
        orderCount: 2,
        minimumLines: 1,
        maximumLines: 1,
        minimumUnits: Number.MAX_SAFE_INTEGER - 1,
        maximumUnits: Number.MAX_SAFE_INTEGER - 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_aggregate" }] },
    });
    for (const change of [
      { maximumUnits: Number.MAX_SAFE_INTEGER },
      { minimumLines: 4 },
      { onTimeProbability: 1.01 },
      { orderCount: 129 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
