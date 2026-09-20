import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  fifoInventoryTransactionTraceExample as example,
  calculateFifoInventoryTransactionTrace,
} from "./tool.js";

describe("Random FIFO Inventory Transaction Trace Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFifoInventoryTransactionTrace(example.input)).toEqual({
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
  it("independently replays the FIFO queue and conserves exact inventory after every event", () => {
    const result = tool.execute({ ...example.input, eventCount: 100 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const queue = result.output.initialLayers.map((layer) => ({ ...layer }));
    for (const event of result.output.events) {
      expect(event.stockBefore).toBe(
        queue.reduce((s, l) => s + l.remainingUnits, 0),
      );
      if (event.kind === "receipt") {
        if (event.receiptLayerId === null)
          throw new Error("A receipt needs its new layer ID.");
        queue.push({
          layerId: event.receiptLayerId,
          remainingUnits: event.quantity,
        });
      } else {
        let left = event.quantity;
        const consumed: { layerId: string; units: number }[] = [];
        while (left > 0) {
          const first = queue[0],
            units = Math.min(left, first.remainingUnits);
          consumed.push({ layerId: first.layerId, units });
          first.remainingUnits -= units;
          left -= units;
          if (!first.remainingUnits) queue.shift();
        }
        expect(event.consumption).toEqual(consumed);
      }
      expect(event.layers).toEqual(queue);
      expect(event.stockAfter).toBe(
        queue.reduce((s, l) => s + l.remainingUnits, 0),
      );
    }
    expect(result.output.finalLayers).toEqual(queue);
  });
  it("crosses multiple layers in one issue and forces a receipt after emptying stock", () => {
    expect(
      tool.execute(
        {
          initialQuantities: [2, 3],
          minimumReceipt: 4,
          maximumReceipt: 4,
          receiptProbability: 0,
          eventCount: 2,
        },
        { random: () => 0.99 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        events: [
          {
            kind: "issue",
            quantity: 5,
            consumption: [
              { layerId: "initial-1", units: 2 },
              { layerId: "initial-2", units: 3 },
            ],
            stockAfter: 0,
          },
          { kind: "receipt", quantity: 4, stockBefore: 0, stockAfter: 4 },
        ],
      },
    });
  });
  it("rejects unsafe stock and malformed input without altering supplied receipt quantities", () => {
    expect(
      tool.execute({
        ...example.input,
        initialQuantities: [Number.MAX_SAFE_INTEGER],
        receiptProbability: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_aggregate" }] },
    });
    for (const change of [
      { initialQuantities: [0] },
      { minimumReceipt: 5 },
      { receiptProbability: -1 },
      { eventCount: 129 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
