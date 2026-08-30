import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dedekindSumInputSchema, dedekindSumOutputSchema } from "./index.js";

describe("math/dedekind-sum", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dedekindSumInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dedekindSumOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      h: "-1",
      k: 5,
    })).toEqual({ ok: true, output: {
      numerator: "-1",
      denominator: "5",
      value: -0.2,
    } });
    expect(tool.execute({
      h: "2",
      k: 5,
    })).toEqual({ ok: true, output: {
      numerator: "0",
      denominator: "1",
      value: 0,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      h: "1",
      k: 1,
    })).toEqual({ ok: true, output: {
      numerator: "0",
      denominator: "1",
      value: 0,
    } });
    expect(tool.execute({
      h: "0",
      k: 7,
    })).toEqual({ ok: true, output: {
      numerator: "0",
      denominator: "1",
      value: 0,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "h", code: "invalid_type" }] } });
    expect(tool.execute({
      h: "1",
      k: 5,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      h: "1",
      k: 0,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "k", code: "out_of_range" }] } });
  });

});
