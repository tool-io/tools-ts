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
  it("normalization retains very small spectra and avoids overflow for large repeated roots", () => {
    const tiny = calculate({
      matrix: [
        [1e-200, 0],
        [0, 2e-200],
      ],
    });
    expect(tiny.eigenvalueRealParts[0] / 2e-200).toBeCloseTo(1, 12);
    expect(tiny.eigenvalueRealParts[1] / 1e-200).toBeCloseTo(1, 12);
    expect(tiny.repeatedEigenvalue).toBe(false);
    expect(
      calculate({
        matrix: [
          [1e200, 0],
          [0, 1e200],
        ],
      }).eigenvalueRealParts,
    ).toEqual([1e200, 1e200]);
  });
  it("stable companion root retains small eigenvalue instead of cancellation", () => {
    expect(
      calculate({
        matrix: [
          [1e20, 0],
          [0, 1],
        ],
      }).eigenvalueRealParts,
    ).toEqual([1e20, 1]);
  });
  it("retains imaginary eigenvalues rather than clipping a negative discriminant", () => {
    const r = calculate(example.input);
    expect(r.eigenvalueImaginaryParts).toEqual([1, -1]);
  });
  it("real eigenvalues satisfy independently computed characteristic polynomial", () => {
    const r = calculate({
      matrix: [
        [1, 2],
        [3, 4],
      ],
    });
    for (const x of r.eigenvalueRealParts)
      expect(x * x - 5 * x - 2).toBeCloseTo(0, 12);
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
  it("rejects invalid domains and unbounded requests", () => {
    const input = {
      ...example.input,
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      matrix: [
        [2, 0],
        [0, 2],
      ],
    };
    close(calculate(input), {
      eigenvalueRealParts: [2, 2],
      eigenvalueImaginaryParts: [0, 0],
      repeatedEigenvalue: true,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        eigenvalueRealParts: [2, 2],
        eigenvalueImaginaryParts: [0, 0],
        repeatedEigenvalue: true,
      });
  });
});
