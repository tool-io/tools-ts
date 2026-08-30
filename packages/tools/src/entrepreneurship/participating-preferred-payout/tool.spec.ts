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
  it("caps all preferred proceeds at the available exit value", () => {
    expect(calculate({ ...example.input, exitProceeds: 100 })).toEqual({
      preferencePayout: 100,
      participationPayout: 0,
      preferredTotal: 100,
      commonPayout: 0,
    });
  });
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
});
