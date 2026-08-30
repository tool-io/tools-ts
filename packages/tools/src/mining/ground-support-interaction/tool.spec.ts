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
  it("rejects multiple roots and coincident curve intervals", () => {
    expect(() =>
      calculate({
        ...example.input,
        groundPressuresMpa: [1, 0, 1],
        supportPressuresMpa: [0, 1, 0],
      }),
    ).toThrow();
    expect(() =>
      calculate({ ...example.input, supportPressuresMpa: [2, 1, 1] }),
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
      if (typeof v === "number")
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("rejects invalid domain parameters", () => {
    const input = { ...example.input, supportPressuresMpa: [0, 0, 0] };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles an independent boundary scenario", () => {
    const input = { ...example.input, supportPressuresMpa: [0, 1, 2] };
    close(calculate(input), {
      equilibriumDisplacementMm: 10,
      equilibriumPressureMpa: 1,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        equilibriumDisplacementMm: 10,
        equilibriumPressureMpa: 1,
      });
  });
});
