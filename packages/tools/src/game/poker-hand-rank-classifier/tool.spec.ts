import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
declare const structuredClone: <T>(value: T) => T;
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("rejects trailing whitespace rather than inventing an additional distinct physical card", () => {
    expect(
      tool.execute({ fiveCardHand: ["AS", "AS\n", "AC", "AH", "KS"] }),
    ).toMatchObject({ ok: false });
  });
  it("orders multiplicities and rank tie-breaks independently of suits", () => {
    for (const [fiveCardHand, categoryRank, tieBreakRanks] of [
      [["AS", "AD", "KC", "QH", "JD"], 1, [14, 13, 12, 11]],
      [["AS", "AD", "KC", "KH", "JD"], 2, [14, 13, 11]],
      [["AS", "AD", "AC", "KH", "JD"], 3, [14, 13, 11]],
      [["2S", "3D", "4C", "5H", "6D"], 4, [6]],
      [["2S", "5S", "7S", "9S", "KS"], 5, [13, 9, 7, 5, 2]],
      [["AS", "AD", "AC", "AH", "KD"], 7, [14, 13]],
    ] as const) {
      const r = calculate({ fiveCardHand });
      expect(r.categoryRank).toBe(categoryRank);
      expect(r.tieBreakRanks).toEqual(tieBreakRanks);
    }
  });
  it("computes independently specified canonical results", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects mistyped and nonfinite fields", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and does not mutate caller evidence", () => {
    const input = structuredClone(example.input),
      before = structuredClone(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(input).toEqual(before);
  });
  it("rejects invalid domains and resource requests", () => {
    const input = {
      ...example.input,
      fiveCardHand: ["AS", "AS", "3S", "4S", "5S"],
    };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      fiveCardHand: ["AH", "AD", "AC", "KS", "KD"],
    };
    close(calculate(input), {
      handCategory: "full-house",
      categoryRank: 6,
      tieBreakRanks: [14, 13],
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        handCategory: "full-house",
        categoryRank: 6,
        tieBreakRanks: [14, 13],
      });
  });
});
