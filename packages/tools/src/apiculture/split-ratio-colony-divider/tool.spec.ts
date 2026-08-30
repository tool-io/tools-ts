import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
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
  it("conserves indivisible inventories with deterministic remainder ties", () => {
    for (let total = 0; total < 20; total++) {
      const result = calculate({
        ...example.input,
        parentAdultBeeCount: total,
        parentBroodFrameCount: total,
        splitWeights: [1, 1, 1],
      });
      expect(result.adultBeeAllocations.reduce((a, b) => a + b, 0)).toBe(total);
      expect(result.broodFrameAllocations).toEqual(result.adultBeeAllocations);
      expect(result.adultBeeAllocations[0]).toBeGreaterThanOrEqual(
        result.adultBeeAllocations[2],
      );
      expect(result.feedAllocationsKg.reduce((a, b) => a + b, 0)).toBeCloseTo(
        9,
      );
    }
  });
  it("bounds allocation work and rejects overflowed weight sums", () => {
    expect(() =>
      calculate({ ...example.input, splitWeights: Array(129).fill(1) }),
    ).toThrow();
    expect(() =>
      calculate({
        ...example.input,
        splitWeights: [Number.MAX_VALUE, Number.MAX_VALUE],
      }),
    ).toThrow();
  });
  it("computes independent canonical results", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and portable examples", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects malformed and nonfinite fields", () => {
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
  it("rejects invalid domain parameters", () => {
    const input = { ...example.input, splitWeights: [0, 0] };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles an independent boundary scenario", () => {
    const input = { ...example.input, splitWeights: [1, 0] };
    close(calculate(input), {
      adultBeeAllocations: [101, 0],
      broodFrameAllocations: [8, 0],
      feedAllocationsKg: [9, 0],
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        adultBeeAllocations: [101, 0],
        broodFrameAllocations: [8, 0],
        feedAllocationsKg: [9, 0],
      });
  });
});
