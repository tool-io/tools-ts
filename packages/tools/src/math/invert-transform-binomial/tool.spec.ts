import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, invertTransformBinomialInputSchema, invertTransformBinomialOutputSchema } from "./index.js";

describe("math/invert-transform-binomial", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, invertTransformBinomialInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, invertTransformBinomialOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      values: ["1", "2", "4", "8"],
    })).toEqual({ ok: true, output: {
      values: ["1", "1", "1", "1"],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      values: [],
    })).toEqual({ ok: true, output: {
      values: [],
    } });
    expect(tool.execute({
      values: ["-7"],
    })).toEqual({ ok: true, output: {
      values: ["-7"],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({
      values: ["1", "3", "8", "20"],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ values: [1, "2"] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.0", code: "invalid_type" }] } });
  });

});
