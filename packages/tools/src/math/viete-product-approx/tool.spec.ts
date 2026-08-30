import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, vieteProductApproxInputSchema, vieteProductApproxOutputSchema } from "./index.js";

describe("math/viete-product-approx", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, vieteProductApproxInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, vieteProductApproxOutputSchema)).toBe(true);
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
      terms: 10001,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "resource_limit" }] } });
  });
  it("matches the nested-radical value and approaches pi", () => {
    const two = tool.execute({ terms: 2 });
    const many = tool.execute({ terms: 30 });
    if (!two.ok || !many.ok) throw new Error("Expected approximations");
    expect(two.output.value).toBeCloseTo(3.061467458920718, 14);
    expect(many.output.value).toBeCloseTo(Math.PI, 13);
  });
});
