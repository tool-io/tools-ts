import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, linearCongruenceSolutionInputSchema, linearCongruenceSolutionOutputSchema } from "./index.js";

describe("math/linear-congruence-solution", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, linearCongruenceSolutionInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, linearCongruenceSolutionOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      a: "6",
      b: "5",
      modulus: "9",
    })).toEqual({ ok: true, output: {
      solvable: false,
      residue: "0",
      period: "0",
      multiplicity: "0",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      a: "0",
      b: "0",
      modulus: "7",
    })).toEqual({ ok: true, output: {
      solvable: true,
      residue: "0",
      period: "1",
      multiplicity: "7",
    } });
    expect(tool.execute({
      a: "-3",
      b: "1",
      modulus: "11",
    })).toEqual({ ok: true, output: {
      solvable: true,
      residue: "7",
      period: "11",
      multiplicity: "1",
    } });
    expect(tool.execute({
      a: "0",
      b: "12",
      modulus: "1",
    })).toEqual({ ok: true, output: {
      solvable: true,
      residue: "0",
      period: "1",
      multiplicity: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "a", code: "invalid_type" }] } });
    expect(tool.execute({
      a: "14",
      b: "30",
      modulus: "100",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      a: "2",
      b: "3",
      modulus: "0",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "modulus", code: "invalid_format" }] } });
  });

});
