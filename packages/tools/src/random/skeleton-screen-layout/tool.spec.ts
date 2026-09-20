import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  skeletonScreenLayoutExample as example,
  calculateSkeletonScreenLayout,
} from "./tool.js";

describe("random/skeleton-screen-layout", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateSkeletonScreenLayout(example.input),
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
      "canvasWidthPx",
      "canvasHeightPx",
      "slots",
      "textLines",
      "lineHeightPx",
      "lineGapPx",
      "textWidthPercent",
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
  it("keeps independent line spacing and slot geometry", () => {
    const r = tool.execute(example.input);
    if (!r.ok) throw new Error("Expected skeleton");
    expect(r.output.rectangles.map((x) => x.y)).toEqual([0, 15, 0]);
    expect(r.output.rectangles.map((x) => x.areaPxSquared)).toEqual([
      864, 1116, 1600,
    ]);
    expect(r.output.bounds).toEqual({
      minX: 0,
      minY: 0,
      maxX: 180,
      maxY: 40,
      width: 180,
      height: 40,
    });
  });
  it("rejects overlapping slots, impossible line counts, and sparse content", () => {
    expect(
      tool.execute({
        ...example.input,
        slots: [example.input.slots[0], { ...example.input.slots[1], x: 10 }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "overlapping_slots", field: "slots.1" }] },
    });
    expect(
      tool.execute({ ...example.input, textLines: { minimum: 8, maximum: 8 } }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "infeasible_text_lines", field: "textLines" }],
      },
    });
    expect(tool.execute({ ...example.input, slots: Array(2) })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "slots" }] },
    });
  });
});
