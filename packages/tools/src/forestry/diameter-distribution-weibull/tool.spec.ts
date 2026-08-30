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
  it("retains tiny class shares without subtracting rounded near-one survival", () => {
    const r = calculate({ ...example.input, weibullScaleCm: 1e20 });
    expect(r.expectedClassStemCounts[0] / 1e-17).toBeCloseTo(1, 12);
    expect(r.expectedClassStemCounts[1] / 1e-17).toBeCloseTo(1, 12);
  });
  it("handles saturated hazard tails without Infinity minus Infinity", () => {
    const r = calculate({
      ...example.input,
      diameterClassEdgesCm: [1e100, 2e100],
      weibullScaleCm: 1e-100,
      weibullShape: 2,
    });
    expect(r.expectedClassStemCounts).toEqual([0]);
    expect(r.expectedBelowFirstClassStemCount).toBe(100);
    expect(r.expectedAboveLastClassStemCount).toBe(0);
  });
  it("class counts plus unobserved tails conserve the declared stand inventory", () => {
    const r = calculate({
      ...example.input,
      diameterClassEdgesCm: [5, 10, 20],
    });
    expect(
      r.expectedBelowFirstClassStemCount +
        r.expectedAboveLastClassStemCount +
        r.expectedClassStemCounts.reduce((a, b) => a + b, 0),
    ).toBeCloseTo(100, 12);
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
    const input = { ...example.input, weibullShape: 0 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles an independent boundary scenario", () => {
    const input = { ...example.input, standStemCount: 0 };
    close(calculate(input), {
      expectedClassStemCounts: [0, 0],
      expectedBelowFirstClassStemCount: 0,
      expectedAboveLastClassStemCount: 0,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        expectedClassStemCounts: [0, 0],
        expectedBelowFirstClassStemCount: 0,
        expectedAboveLastClassStemCount: 0,
      });
  });
});
