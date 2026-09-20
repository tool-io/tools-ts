import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  deliveryAttemptOutcomeDatasetExample as example,
  calculateDeliveryAttemptOutcomeDataset,
} from "./tool.js";

describe("Random Delivery Attempt Outcome Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateDeliveryAttemptOutcomeDataset(example.input)).toEqual({
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
  it("stops exactly at the first success and includes all failed-attempt costs in the denominator-scoped summary", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const stop of result.output.stops) {
      expect(
        stop.attempts.slice(0, -1).every((attempt) => !attempt.success),
      ).toBe(true);
      const lastAttempt = stop.attempts.at(-1);
      if (!lastAttempt)
        throw new Error("Every stop requires an attempted delivery.");
      expect(stop.completed).toBe(lastAttempt.success);
      expect(stop.firstAttemptSuccess).toBe(stop.attempts[0].success);
    }
    const sum = result.output.stops
      .flatMap((s) => s.attempts)
      .reduce((s, a) => s + a.costMinorUnits, 0);
    expect(result.output.summary.totalCostMinorUnits).toBe(sum);
    expect(result.output.summary.totalDeliveryCost).toBe(sum / 100);
  });
  it("retains all-failed and immediate-success endpoint datasets", () => {
    const failed = tool.execute({
      ...example.input,
      firstSuccessProbability: 0,
      laterSuccessProbability: 0,
    });
    expect(failed).toMatchObject({
      ok: true,
      output: {
        summary: {
          completedDrops: 0,
          failedDrops: 3,
          firstAttemptSuccessPercent: 0,
          costPerDrop: null,
          costUndefinedReason: "no-completed-drops",
        },
      },
    });
    if (failed.ok)
      expect(failed.output.stops.every((s) => s.attempts.length === 3)).toBe(
        true,
      );
    const success = tool.execute({
      ...example.input,
      firstSuccessProbability: 1,
    });
    expect(success).toMatchObject({
      ok: true,
      output: {
        summary: { completedDrops: 3, firstAttemptSuccessPercent: 100 },
      },
    });
    if (success.ok)
      expect(success.output.stops.every((s) => s.attempts.length === 1)).toBe(
        true,
      );
  });
  it("retains zero costs and rejects unsafe totals or invalid probabilities", () => {
    expect(
      tool.execute({
        ...example.input,
        minimumCostMinorUnits: 0,
        maximumCostMinorUnits: 0,
        firstSuccessProbability: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: { summary: { totalDeliveryCost: 0, costPerDrop: 0 } },
    });
    expect(
      tool.execute({
        ...example.input,
        minimumCostMinorUnits: Number.MAX_SAFE_INTEGER,
        maximumCostMinorUnits: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_aggregate" }] },
    });
    for (const change of [
      { firstSuccessProbability: 2 },
      { minimumCostMinorUnits: 301 },
      { minorUnitsPerUnit: 0 },
      { maximumAttempts: 17 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
