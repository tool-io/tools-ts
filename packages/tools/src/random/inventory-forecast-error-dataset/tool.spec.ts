import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  inventoryForecastErrorDatasetExample as example,
  calculateInventoryForecastErrorDataset,
} from "./tool.js";

describe("Random Inventory Forecast Error Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateInventoryForecastErrorDataset(example.input)).toEqual({
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
  it("retains each actual generated forecast rule and delegates signed bias separately from absolute error", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const out = result.output;
    for (const row of out.rows) {
      if (row.pattern === "perfect") {
        expect(row.parameter).toBeNull();
        expect(row.rawForecast).toBe(row.actualUnits);
      } else {
        if (row.parameter === null)
          throw new Error("A generated error pattern needs its parameter.");
        expect(row.rawForecast).toBe(
          row.pattern === "additive"
            ? row.actualUnits + row.parameter
            : row.actualUnits * row.parameter,
        );
      }
      expect(row.forecastUnits).toBe(Math.max(0, row.rawForecast));
    }
    const error = out.rows.reduce(
        (sum, row) => sum + Math.abs(row.forecastUnits - row.actualUnits),
        0,
      ),
      actual = out.rows.reduce((sum, row) => sum + row.actualUnits, 0);
    if (out.wmape === null)
      throw new Error("Positive actual demand needs WMAPE evidence.");
    expect(out.meanAbsoluteError).toBe(error / out.rows.length);
    expect(out.wmape.wmapePercent).toBe((error / actual) * 100);
  });
  it("retains all-zero-demand undefined WMAPE, perfect cases and explicit clamping", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumActual: 0,
        maximumActual: 0,
        patterns: ["perfect"],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        meanAbsoluteError: 0,
        wmape: null,
        wmapeUndefinedReason: "zero-actual-demand",
      },
    });
    const perfect = tool.execute({
      ...example.input,
      minimumActual: 1,
      patterns: ["perfect"],
    });
    expect(perfect).toMatchObject({
      ok: true,
      output: {
        meanAbsoluteError: 0,
        wmape: { absoluteErrorTotal: 0, biasPercent: 0, wmapePercent: 0 },
      },
    });
    const clipped = tool.execute({
      ...example.input,
      minimumActual: 1,
      maximumActual: 1,
      patterns: ["additive"],
      minimumDelta: -4,
      maximumDelta: -4,
      count: 1,
    });
    expect(clipped).toMatchObject({
      ok: true,
      output: {
        rows: [{ rawForecast: -3, forecastUnits: 0, clampedAtZero: true }],
      },
    });
  });
  it("rejects overflow, unsupported patterns, invalid factors and ranges", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumActual: 10,
        maximumActual: 10,
        patterns: ["multiplicative"],
        factors: [Number.MAX_VALUE],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "forecast_overflow" }] },
    });
    for (const change of [
      { patterns: ["unknown"] },
      { factors: [-1] },
      { minimumDelta: 5 },
      { count: 129 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
