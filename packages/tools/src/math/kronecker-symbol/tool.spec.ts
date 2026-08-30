import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, kroneckerSymbolInputSchema, kroneckerSymbolOutputSchema } from "./index.js";

describe("math/kronecker-symbol", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, kroneckerSymbolInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, kroneckerSymbolOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      numerator: "13",
      denominator: "21",
    })).toEqual({ ok: true, output: {
      symbol: -1,
    } });
    expect(tool.execute({
      numerator: "101",
      denominator: "4",
    })).toEqual({ ok: true, output: {
      symbol: 1,
    } });
    expect(tool.execute({
      numerator: "-3",
      denominator: "-8",
    })).toEqual({ ok: true, output: {
      symbol: 1,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({ numerator: "-6", denominator: "-3" })).toEqual({
      ok: true,
      output: { symbol: 0 },
    });
    expect(tool.execute({
      numerator: "-1",
      denominator: "0",
    })).toEqual({ ok: true, output: {
      symbol: 1,
    } });
    expect(tool.execute({
      numerator: "2",
      denominator: "0",
    })).toEqual({ ok: true, output: {
      symbol: 0,
    } });
    expect(tool.execute({
      numerator: "0",
      denominator: "-1",
    })).toEqual({ ok: true, output: {
      symbol: 1,
    } });
    expect(tool.execute({
      numerator: "-1",
      denominator: "-1",
    })).toEqual({ ok: true, output: {
      symbol: -1,
    } });
    expect(tool.execute({
      numerator: "2",
      denominator: "4",
    })).toEqual({ ok: true, output: {
      symbol: 0,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "numerator", code: "invalid_type" }] } });
    expect(tool.execute({
      numerator: "3",
      denominator: "8",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
