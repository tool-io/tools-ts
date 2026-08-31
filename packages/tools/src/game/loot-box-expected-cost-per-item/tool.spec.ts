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
  it("computes the twelve-equal-target harmonic expectation with stable subset recurrence", () => {
    const r = calculate({
      targetItemProbabilities: Array(12).fill(1 / 16),
      alreadyOwnedFlags: Array(12).fill(0),
      callerCostPerBox: 1,
    });
    expect(r.expectedBoxesToCompleteTargets).toBeCloseTo(
      16 *
        Array.from({ length: 12 }, (_, i) => 1 / (i + 1)).reduce(
          (a, b) => a + b,
          0,
        ),
      10,
    );
  });
  it("keeps owned targets and non-target award mass separate", () => {
    close(
      calculate({
        targetItemProbabilities: [0.25, 0.25],
        alreadyOwnedFlags: [1, 0],
        callerCostPerBox: 3,
      }),
      {
        unownedTargetItemCount: 1,
        expectedBoxesToCompleteTargets: 4,
        expectedAdditionalCollectionCost: 12,
      },
    );
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
    const input = { ...example.input, targetItemProbabilities: [0.6, 0.6] };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = { ...example.input, alreadyOwnedFlags: [1, 1] };
    close(calculate(input), {
      unownedTargetItemCount: 0,
      expectedBoxesToCompleteTargets: 0,
      expectedAdditionalCollectionCost: 0,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        unownedTargetItemCount: 0,
        expectedBoxesToCompleteTargets: 0,
        expectedAdditionalCollectionCost: 0,
      });
  });
});
