import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  tuningSystemComparisonSetExample as example,
  calculateTuningSystemComparisonSet,
} from "./tool.js";

describe("random/tuning-system-comparison-set", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateTuningSystemComparisonSet(example.input),
      tool.execute(example.input),
    ]) {
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      expect(result.output).toEqual(example.output);
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("preserves input, replays seeds, and gives an explicit seed precedence", () => {
    const input = JSON.parse(JSON.stringify(example.input));
    const before = JSON.stringify(input);
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(JSON.stringify(input)).toBe(before);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual(tool.execute(example.input));
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const result = tool.execute(unseeded, { random: () => 0.5 });
    if (!result.ok) throw new Error(JSON.stringify(result.error));
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
  });
  it("returns stable malformed-input and checked-source failures", () => {
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    const missing = tool.execute({});
    expect(missing).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
    if (missing.ok)
      throw new Error("Expected every required-field diagnostic.");
    const requiredFields = ["count", "intervals", "referenceHertz"];
    expect(missing.error.issues).toHaveLength(requiredFields.length);
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(
      expect.arrayContaining(
        requiredFields.map((field) => ({ field, code: "required_field" })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
  it("independently agrees on an octave and retains the sign of fifth deviation", () => {
    const r = tool.execute({
      ...example.input,
      intervals: [
        { id: "octave", numerator: 2, denominator: 1, matchedSemitones: 12 },
      ],
    });
    if (!r.ok) throw new Error("Expected table");
    for (const x of r.output.comparisons) {
      expect(x.justHertz).toBe(880);
      expect(x.equalHertz).toBe(880);
      expect(x.justCents).toBe(1200);
      expect(x.differenceCents).toBe(0);
    }
    expect(example.output.comparisons[1].differenceCents).toBeGreaterThan(0);
  });
  it("rejects duplicate IDs, malformed ratios, resource excess and frequency overflow", () => {
    expect(
      tool.execute({
        ...example.input,
        intervals: [example.input.intervals[0], example.input.intervals[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "duplicate_entries", field: "intervals" }] },
    });
    expect(tool.execute({ ...example.input, count: 129 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "count" }] },
    });
    expect(
      tool.execute({ ...example.input, referenceHertz: 1.7e308 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_range", field: "referenceHertz" }] },
    });
  });
});
