import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, agmApproxInputSchema, agmApproxOutputSchema } from "./index.js";

describe("math/agm-approx", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, agmApproxInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, agmApproxOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      first: 4,
      second: 1,
      iterations: 2,
    })).toEqual({ ok: true, output: {
      value: 2.25,
      geometric: 2.23606797749979,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      first: 8,
      second: 0,
      iterations: 3,
    })).toEqual({ ok: true, output: {
      value: 1,
      geometric: 0,
    } });
    expect(tool.execute({
      first: 5,
      second: 5,
      iterations: 20,
    })).toEqual({ ok: true, output: {
      value: 5,
      geometric: 5,
    } });
    expect(tool.execute({
      first: 0,
      second: 0,
      iterations: 0,
    })).toEqual({ ok: true, output: {
      value: 0,
      geometric: 0,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "invalid_type" }] } });
    expect(tool.execute({
      first: 4,
      second: 1,
      iterations: 1,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, first: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "invalid_type" }] } });
    expect(tool.execute({ first: Infinity, second: 1, iterations: 2 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "invalid_type" }] } });
    expect(tool.execute({
      first: -1,
      second: 1,
      iterations: 2,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "first", code: "out_of_range" }] } });
  });
  it("preserves equal extreme inputs and finite subnormal iterates", () => {
    expect(tool.execute({ first: Number.MAX_VALUE, second: Number.MAX_VALUE, iterations: 20 })).toEqual({ ok: true, output: { value: Number.MAX_VALUE, geometric: Number.MAX_VALUE } });
    const result = tool.execute({ first: 2 * Number.MIN_VALUE, second: Number.MIN_VALUE, iterations: 1 });
    if (!result.ok) throw new Error("Expected finite subnormal iterates");
    expect(result.output.value).toBe(2 * Number.MIN_VALUE);
    expect(result.output.geometric).toBe(Number.MIN_VALUE);
  });
});
