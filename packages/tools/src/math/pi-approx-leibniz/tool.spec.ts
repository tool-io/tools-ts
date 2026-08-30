import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, piApproxLeibnizInputSchema, piApproxLeibnizOutputSchema } from "./index.js";

describe("math/pi-approx-leibniz", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, piApproxLeibnizInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, piApproxLeibnizOutputSchema)).toBe(true);
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      terms: 1,
    })).toEqual({ ok: true, output: {
      value: 4,
      truncationBound: 1.3333333333333333,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "invalid_type" }] } });
    expect(tool.execute({
      terms: 2,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      terms: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "invalid_type" }] } });
    expect(tool.execute({
      terms: 0,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "out_of_range" }] } });
  });
  it("matches the independently reduced four-term rational", () => {
    const result = tool.execute({ terms: 4 });
    if (!result.ok) throw new Error("Expected a partial sum");
    expect(result.output.value).toBeCloseTo(304 / 105, 14);
    expect(Math.abs(result.output.value - Math.PI)).toBeLessThan(result.output.truncationBound);
  });
});
