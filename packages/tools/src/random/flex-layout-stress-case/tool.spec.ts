import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  flexLayoutStressCaseExample as example,
  calculateFlexLayoutStressCase,
} from "./tool.js";

describe("random/flex-layout-stress-case", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateFlexLayoutStressCase(example.input),
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
      "itemCount",
      "containerWidthPx",
      "basisPx",
      "grow",
      "shrink",
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
  it("independently checks proportional shrink and conservation", () => {
    const r = tool.execute(example.input);
    if (!r.ok) throw new Error("Expected flex case");
    expect(r.output.items.map((x) => x.basisPx)).toEqual([145, 117]);
    expect(r.output.items[0].adjustmentPx).toBeCloseTo((-22 * 145) / 262, 12);
    expect(
      r.output.items.reduce((s, x) => s + x.preliminarySizePx, 0),
    ).toBeCloseTo(240, 12);
  });
  it("preserves zero adjustments and fully distributed remainders across JSON transport", () => {
    for (const factor of [0, 1]) {
      const result = tool.execute({
        ...example.input,
        shrink: { minimum: factor, maximum: factor },
      });
      if (!result.ok) throw new Error("Expected shrink case");
      expect(JSON.parse(JSON.stringify(result.output))).toEqual(result.output);
      expect(Object.is(result.output.remainingSpacePx, -0)).toBe(false);
      for (const item of result.output.items)
        expect(Object.is(item.adjustmentPx, -0)).toBe(false);
      if (factor === 0)
        expect(result.output.items.map((item) => item.adjustmentPx)).toEqual([
          0, 0,
        ]);
      else expect(result.output.remainingSpacePx).toBe(0);
    }
  });
  it("covers zero factors and large shrink before freezing", () => {
    const r = tool.execute({
      ...example.input,
      containerWidthPx: { minimum: 500, maximum: 500 },
      grow: { minimum: 0, maximum: 0 },
    });
    if (!r.ok) throw new Error("Expected flex");
    expect(r.output.items.every((x) => x.adjustmentPx === 0)).toBe(true);
    expect(r.output.remainingSpacePx).toBe(238);
    expect(tool.execute({ ...example.input, itemCount: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "itemCount" }] },
    });
  });
});
