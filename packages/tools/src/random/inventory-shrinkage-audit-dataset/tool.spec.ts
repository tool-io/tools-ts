import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  inventoryShrinkageAuditDatasetExample as example,
  calculateInventoryShrinkageAuditDataset,
} from "./tool.js";

describe("Random Inventory Shrinkage Audit Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateInventoryShrinkageAuditDataset(example.input)).toEqual({
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
  it("retains overage as negative shrinkage and distinguishes zero-book undefined percentages", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const row of result.output.rows) {
      expect(row.physicalCountUnits).toBe(
        Math.max(0, row.bookInventoryUnits + row.requestedDelta),
      );
      expect(row.unitsLost).toBe(
        row.bookInventoryUnits - row.physicalCountUnits,
      );
      expect(row.shrinkagePercent).toBe(
        row.bookInventoryUnits
          ? (row.unitsLost / row.bookInventoryUnits) * 100
          : null,
      );
    }
  });
  it("exposes clamping instead of implying the requested negative count existed", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumBookUnits: 2,
        maximumBookUnits: 2,
        minimumDelta: -5,
        maximumDelta: -5,
        count: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        rows: [
          {
            requestedDelta: -5,
            physicalCountUnits: 0,
            clampedAtZero: true,
            unitsLost: 2,
            shrinkagePercent: 100,
          },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        minimumBookUnits: 0,
        maximumBookUnits: 0,
        minimumDelta: 0,
        maximumDelta: 0,
        count: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        rows: [
          {
            unitsLost: 0,
            shrinkagePercent: null,
            undefinedReason: "zero-book-inventory",
          },
        ],
      },
    });
  });
  it("rejects unsafe counts, unsafe inclusive spans and malformed bounds", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumBookUnits: Number.MAX_SAFE_INTEGER,
        maximumBookUnits: Number.MAX_SAFE_INTEGER,
        minimumDelta: 1,
        maximumDelta: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "count_overflow" }] },
    });
    for (const change of [
      {
        minimumDelta: -Number.MAX_SAFE_INTEGER,
        maximumDelta: Number.MAX_SAFE_INTEGER,
      },
      { minimumBookUnits: 4 },
      { count: 129 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
