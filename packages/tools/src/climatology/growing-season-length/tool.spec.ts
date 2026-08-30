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
  it("does not call a warm run already underway at the first observed day a confirmed onset", () => {
    expect(
      calculate({
        ...example.input,
        dailyMeanTemperaturesC: [10, 10, 10, 10, 0, 0],
      }).onsetLeftCensored,
    ).toBe(true);
  });
  it("preserves an unobserved end as right-censored rather than a confirmed cold onset", () => {
    const r = calculate({
      ...example.input,
      dailyMeanTemperaturesC: [0, 10, 10, 10, 10, 10],
    });
    expect(r.endRightCensored).toBe(true);
    expect(r.observedGrowingSeasonLengthDays).toBe(5);
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
    const input = { ...example.input, searchColdEndFromIndex: 10 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles an independent boundary scenario", () => {
    const input = {
      ...example.input,
      dailyMeanTemperaturesC: [0, 10, 10, 10, 10, 10],
    };
    close(calculate(input), {
      growingSeasonStartIndex: 1,
      growingSeasonEndIndexExclusive: 6,
      observedGrowingSeasonLengthDays: 5,
      endRightCensored: true,
      onsetLeftCensored: false,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        growingSeasonStartIndex: 1,
        growingSeasonEndIndexExclusive: 6,
        observedGrowingSeasonLengthDays: 5,
        endRightCensored: true,
        onsetLeftCensored: false,
      });
  });
});
