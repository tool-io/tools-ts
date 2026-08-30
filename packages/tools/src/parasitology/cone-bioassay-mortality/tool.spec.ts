import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const approximate = (value: unknown): unknown => {
  if (typeof value === "number") return expect.closeTo(value, 9);
  if (Array.isArray(value)) return value.map(approximate);
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, approximate(v)]),
    );
  return value;
};
describe(tool.id, () => {
  it("computes the independent canonical example", () => {
    expect(calculate(example.input)).toEqual(approximate(example.output));
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: approximate(example.output),
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects invalid domain parameters", () => {
    expect(() => calculate({ ...example.input, controlDead: 100 })).toThrow();
    expect(tool.execute({ ...example.input, controlDead: 100 })).toMatchObject({
      ok: false,
    });
  });
  it("handles an independent boundary scenario", () => {
    expect(calculate({ ...example.input, treatedDead: 0 })).toEqual(
      approximate({
        rawMortalityFraction: 0,
        controlMortalityFraction: 0.1,
        correctedMortalityFraction: 0,
        meetsSuppliedCriterion: false,
      }),
    );
  });
});
