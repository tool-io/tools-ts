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
  it("closes the dispersion equation across shallow and deep regimes", () => {
    for (const depth of [1e-10, 1, 1000]) {
      const input = {
          periodSeconds: 2 * Math.PI,
          waterDepthM: depth,
          gravityMPerSecondSquared: 1,
        },
        result = calculate(input);
      expect(
        result.waveNumberPerM * Math.tanh(result.waveNumberPerM * depth),
      ).toBeCloseTo(1, 10);
      expect(
        result.groupSpeedMPerSecond / result.phaseSpeedMPerSecond,
      ).toBeGreaterThanOrEqual(0.5);
      expect(
        result.groupSpeedMPerSecond / result.phaseSpeedMPerSecond,
      ).toBeLessThanOrEqual(1);
    }
  });
  it("resolves tiny dimensionless shallow-wave scales", () => {
    const result = calculate({
      periodSeconds: 2 * Math.PI * 1e10,
      waterDepthM: 1,
      gravityMPerSecondSquared: 1,
    });
    expect(result.waveNumberPerM / 1e-10).toBeCloseTo(1, 10);
    expect(result.phaseSpeedMPerSecond).toBeCloseTo(1, 10);
  });
  it("rejects a nonrepresentable dispersion scale", () => {
    expect(() =>
      calculate({ ...example.input, periodSeconds: Number.MIN_VALUE }),
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
    const input = { ...example.input, waterDepthM: 0 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles an independent boundary scenario", () => {
    const input = {
      ...example.input,
      periodSeconds: 12.566370614359172,
      waterDepthM: 4,
    };
    close(calculate(input), {
      waveNumberPerM: 0.25,
      wavelengthM: 25.132741228718345,
      phaseSpeedMPerSecond: 2,
      groupSpeedMPerSecond: 1.5514411295435666,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        waveNumberPerM: 0.25,
        wavelengthM: 25.132741228718345,
        phaseSpeedMPerSecond: 2,
        groupSpeedMPerSecond: 1.5514411295435666,
      });
  });
});
