import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  warehousePickingProductivityDatasetExample as example,
  calculateWarehousePickingProductivityDataset,
} from "./tool.js";

describe("Random Warehouse Picking Productivity Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateWarehousePickingProductivityDataset(example.input)).toEqual(
      { ok: true, output: example.output },
    );
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
  it("conserves generated work and uses aggregate hours instead of averaging rates", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const out = result.output;
    for (const shift of out.shifts) {
      expect(shift.linesPacked).toBe(shift.ordersPicked * shift.linesPerOrder);
      expect(shift.ordersPerHour).toBe(
        shift.ordersPicked / (shift.pickerMinutes / 60),
      );
      expect(shift.linesPerHour).toBe(
        shift.linesPacked / (shift.stationMinutes / 60),
      );
    }
    expect(out.totals.ordersPicked).toBe(
      out.shifts.reduce((sum, s) => sum + s.ordersPicked, 0),
    );
    expect(out.totals.ordersPerHour).toBe(
      out.totals.ordersPicked / (out.totals.pickerMinutes / 60),
    );
    expect(out.totals.ordersPerHour).not.toBe(
      out.shifts.reduce((sum, s) => sum + s.ordersPerHour, 0) /
        out.shifts.length,
    );
  });
  it("retains zero-work shifts without inventing positive throughput", () => {
    const result = tool.execute({
      ...example.input,
      minimumOrders: 0,
      maximumOrders: 0,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        totals: {
          ordersPicked: 0,
          linesPacked: 0,
          ordersPerHour: 0,
          linesPerHour: 0,
        },
      },
    });
    if (result.ok)
      result.output.shifts.forEach((shift) =>
        expect(shift.ordersPerHour).toBe(0),
      );
  });
  it("rejects unsafe work products, zero labor duration and invalid ranges", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumOrders: Number.MAX_SAFE_INTEGER,
        maximumOrders: Number.MAX_SAFE_INTEGER,
        minimumLinesPerOrder: 2,
        maximumLinesPerOrder: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_line_count" }] },
    });
    for (const change of [
      { minimumMinutes: 0 },
      { minimumOrders: 21 },
      { maximumLinesPerOrder: 0 },
      { shiftCount: 129 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
