import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, legendreSymbolInputSchema, legendreSymbolOutputSchema } from "./index.js";

describe("math/legendre-symbol", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, legendreSymbolInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, legendreSymbolOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      numerator: "3",
      prime: 7,
    })).toEqual({ ok: true, output: {
      symbol: -1,
    } });
    expect(tool.execute({
      numerator: "-1",
      prime: 3,
    })).toEqual({ ok: true, output: {
      symbol: -1,
    } });
    expect(tool.execute({
      numerator: "2",
      prime: 7,
    })).toEqual({ ok: true, output: {
      symbol: 1,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      numerator: "0",
      prime: 3,
    })).toEqual({ ok: true, output: {
      symbol: 0,
    } });
    expect(tool.execute({
      numerator: "14",
      prime: 7,
    })).toEqual({ ok: true, output: {
      symbol: 0,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "numerator", code: "invalid_type" }] } });
    expect(tool.execute({
      numerator: "5",
      prime: 11,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      numerator: "1",
      prime: 2,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "prime", code: "out_of_range" }] } });
    expect(tool.execute({
      numerator: "1",
      prime: 9,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "prime", code: "not_odd_prime" }] } });
  });

});
