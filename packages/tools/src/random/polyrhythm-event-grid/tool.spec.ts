import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  polyrhythmEventGridExample as example,
  calculatePolyrhythmEventGrid,
} from "./tool.js";

describe("random/polyrhythm-event-grid", () => {
  it("makes polymeter bar grouping explicit on a shared quarter-note pulse", () => {
    const r = tool.execute({
      ...example.input,
      mode: "polymeter",
      sharedCycleQuarterNotes: 1,
    });
    if (!r.ok) throw new Error("Expected polymeter");
    expect(
      r.output.events
        .filter((e) => e.layer === 0)
        .map((e) => [e.bar, e.pulseInBar]),
    ).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ]);
    expect(
      r.output.events
        .filter((e) => e.layer === 1)
        .map((e) => [e.bar, e.pulseInBar]),
    ).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
      [2, 1],
    ]);
  });
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculatePolyrhythmEventGrid(example.input),
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
      "pulseCounts",
      "mode",
      "sharedCycleQuarterNotes",
      "beatsPerMinute",
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
  it("independently constructs 3-against-2 and excludes the terminal cycle endpoint", () => {
    const r = tool.execute(example.input);
    if (!r.ok) throw new Error("Expected grid");
    expect(r.output.events.map((e) => e.tick)).toEqual([0, 0, 2, 3, 4]);
    expect(r.output.cycleSeconds).toBe(2);
    expect(r.output.events.every((e) => e.tick < 6)).toBe(true);
  });
  it("distinguishes polymeter beat alignment and bounds LCM growth", () => {
    const r = tool.execute({
      ...example.input,
      mode: "polymeter",
      sharedCycleQuarterNotes: 1,
    });
    if (!r.ok) throw new Error("Expected polymeter");
    expect(r.output.cycleQuarterNotes).toBe(6);
    expect(r.output.events).toHaveLength(12);
    expect(
      r.output.events.filter((e) => e.layer === 0).map((e) => e.tick),
    ).toEqual([0, 1, 2, 3, 4, 5]);
    expect(
      tool.execute({
        ...example.input,
        pulseCounts: [
          { minimum: 29, maximum: 29 },
          { minimum: 31, maximum: 31 },
          { minimum: 32, maximum: 32 },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "grid_resource_limit", field: "pulseCounts" }],
      },
    });
  });
});
