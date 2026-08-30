import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const assertClose = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-10,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => assertClose((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [key, value] of Object.entries(expected))
      assertClose((actual as Record<string, unknown>)[key], value);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("computes independent canonical results", () => {
    assertClose(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) assertClose(result.output, example.output);
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects malformed field types and nonfinite scalars", () => {
    for (const [key, value] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [key]: null })).toMatchObject({
        ok: false,
      });
      if (typeof value === "number")
        expect(
          tool.execute({ ...example.input, [key]: Infinity }),
        ).toMatchObject({ ok: false });
    }
  });
  it("rejects invalid domain parameters", () => {
    const input = { ...example.input, orbitalEccentricity: -1 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles an independent boundary scenario", () => {
    assertClose(
      calculate({
        ...example.input,
        trueAnomalyDegrees: -90,
        orbitalEccentricity: 0,
      }),
      { eccentricAnomalyDegrees: 270, meanAnomalyDegrees: 270 },
    );
  });
});
