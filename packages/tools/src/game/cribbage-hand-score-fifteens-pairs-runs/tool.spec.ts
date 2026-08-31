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
  it("scores multiplicative longest runs without counting their shorter subruns", () => {
    close(
      calculate({
        fourHandCards: ["3C", "3D", "4H", "5S"],
        starterCard: "6C",
        isCrib: false,
      }),
      {
        fifteensPoints: 4,
        pairsPoints: 2,
        runsPoints: 8,
        flushPoints: 0,
        nobsPoints: 0,
        handTotalPoints: 14,
        dealerHeelsPoints: 0,
      },
    );
  });
  it("separates crib flush and dealer heels from ordinary hand points", () => {
    const input = {
      fourHandCards: ["AH", "2H", "3H", "4H"],
      starterCard: "JS",
      isCrib: false,
    };
    expect(calculate(input).flushPoints).toBe(4);
    expect(calculate({ ...input, isCrib: true }).flushPoints).toBe(0);
    expect(calculate(input).dealerHeelsPoints).toBe(2);
    expect(calculate(input).handTotalPoints).toBe(12);
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
    const input = { ...example.input, starterCard: "JS" };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      fourHandCards: ["AS", "2D", "3H", "4C"],
      starterCard: "5S",
    };
    close(calculate(input), {
      fifteensPoints: 2,
      pairsPoints: 0,
      runsPoints: 5,
      flushPoints: 0,
      nobsPoints: 0,
      handTotalPoints: 7,
      dealerHeelsPoints: 0,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        fifteensPoints: 2,
        pairsPoints: 0,
        runsPoints: 5,
        flushPoints: 0,
        nobsPoints: 0,
        handTotalPoints: 7,
        dealerHeelsPoints: 0,
      });
  });
});
