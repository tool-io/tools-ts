import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  swingTimingDatasetExample as example,
  calculateSwingTimingDataset,
} from "./tool.js";

describe("random/swing-timing-dataset", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateSwingTimingDataset(example.input),
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
    const requiredFields = [
      "count",
      "ratios",
      "tempoBpm",
      "startMilliseconds",
      "straightShareTolerance",
    ];
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
  it("independently matches the 2:1 split and chronological continuity", () => {
    const r = tool.execute(example.input);
    if (!r.ok) throw new Error("Expected timings");
    expect(r.output.pairs[0].firstDurationMilliseconds).toBeCloseTo(
      1000 / 3,
      12,
    );
    expect(r.output.pairs[0].swingTimingClass).toBe("long-short-swing");
    expect(r.output.pairs[1].swingTimingClass).toBe("reverse-short-long");
    expect(r.output.pairs[1].firstOnsetMilliseconds).toBe(
      r.output.pairs[0].endMilliseconds,
    );
  });
  it("keeps straight timing and rejects lost onset precision and count limits", () => {
    const r = tool.execute({
      ...example.input,
      ratios: [{ first: 1, second: 1 }],
    });
    if (!r.ok) throw new Error("Expected timings");
    expect(r.output.pairs.every((p) => p.swingTimingClass === "straight")).toBe(
      true,
    );
    expect(
      tool.execute({ ...example.input, startMilliseconds: 1e30 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "timing_precision", field: "startMilliseconds" }],
      },
    });
    expect(tool.execute({ ...example.input, count: 129 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "count" }] },
    });
  });
});
