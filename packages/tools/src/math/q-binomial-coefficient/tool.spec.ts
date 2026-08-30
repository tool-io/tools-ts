import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, qBinomialCoefficientInputSchema, qBinomialCoefficientOutputSchema } from "./index.js";

describe("math/q-binomial-coefficient", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, qBinomialCoefficientInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, qBinomialCoefficientOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 5,
      k: 2,
    })).toEqual({ ok: true, output: {
      coefficients: ["1", "1", "2", "2", "2", "1", "1"],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 0,
      k: 0,
    })).toEqual({ ok: true, output: {
      coefficients: ["1"],
    } });
    expect(tool.execute({
      n: 2,
      k: 3,
    })).toEqual({ ok: true, output: {
      coefficients: ["0"],
    } });
    expect(tool.execute({
      n: 3,
      k: 0,
    })).toEqual({ ok: true, output: {
      coefficients: ["1"],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 4,
      k: 2,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, n: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });
  it("has the expected degree, symmetry, and specialization at q=1", () => {
    const result = tool.execute({ n: 8, k: 3 });
    if (!result.ok) throw new Error("Expected a Gaussian polynomial");
    expect(result.output.coefficients.length).toBe(16);
    expect(result.output.coefficients).toEqual([...result.output.coefficients].reverse());
    expect(result.output.coefficients.reduce((sum, value) => sum + BigInt(value), 0n)).toBe(56n);
  });
});
