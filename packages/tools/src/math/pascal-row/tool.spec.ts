import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, pascalRowInputSchema, pascalRowOutputSchema } from "./index.js";

describe("math/pascal-row", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, pascalRowInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, pascalRowOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 3,
    })).toEqual({ ok: true, output: {
      coefficients: ["1", "3", "3", "1"],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 0,
    })).toEqual({ ok: true, output: {
      coefficients: ["1"],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 5,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 1001,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "resource_limit" }] } });
  });
  it("preserves symmetry and the binomial row sum", () => {
    const result = tool.execute({ n: 30 });
    if (!result.ok) throw new Error("Expected a row");
    expect(result.output.coefficients).toEqual([...result.output.coefficients].reverse());
    expect(result.output.coefficients.reduce((sum, item) => sum + BigInt(item), 0n)).toBe(1073741824n);
  });
});
