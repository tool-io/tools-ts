import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, wallisProductApproxInputSchema, wallisProductApproxOutputSchema } from "./index.js";

describe("math/wallis-product-approx", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, wallisProductApproxInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, wallisProductApproxOutputSchema)).toBe(true);
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      terms: 0,
    })).toEqual({ ok: true, output: {
      value: 2,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "invalid_type" }] } });
    expect(tool.execute({
      terms: 1,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      terms: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "invalid_type" }] } });
    expect(tool.execute({
      terms: -1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "out_of_range" }] } });
  });
  it("matches the independent two-factor rational", () => {
    const result = tool.execute({ terms: 2 });
    if (!result.ok) throw new Error("Expected a product");
    expect(result.output.value).toBeCloseTo(128 / 45, 14);
    expect(result.output.value).toBeLessThan(Math.PI);
  });
});
