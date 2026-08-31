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
  it("normalizes all bounded battle dice policies and conserves compared losses", () => {
    for (let attackerDice = 1; attackerDice <= 3; attackerDice++)
      for (let defenderDice = 1; defenderDice <= 2; defenderDice++) {
        const r = calculate({ attackerDice, defenderDice });
        expect(
          r.attackerLossDistribution.reduce((a, b) => a + b, 0),
        ).toBeCloseTo(1, 12);
        expect(r.expectedAttackerLosses + r.expectedDefenderLosses).toBe(
          Math.min(attackerDice, defenderDice),
        );
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
    const input = { ...example.input, attackerDice: 4 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = { ...example.input, attackerDice: 1, defenderDice: 1 };
    close(calculate(input), {
      attackerLossDistribution: [0.4166666666666667, 0.5833333333333334],
      expectedAttackerLosses: 0.5833333333333334,
      expectedDefenderLosses: 0.4166666666666667,
      totalEnumeratedRolls: 36,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        attackerLossDistribution: [0.4166666666666667, 0.5833333333333334],
        expectedAttackerLosses: 0.5833333333333334,
        expectedDefenderLosses: 0.4166666666666667,
        totalEnumeratedRolls: 36,
      });
  });
});
