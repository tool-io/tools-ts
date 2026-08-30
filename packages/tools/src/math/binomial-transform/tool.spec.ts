import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, binomialTransformInputSchema, binomialTransformOutputSchema } from "./index.js";

describe("math/binomial-transform", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, binomialTransformInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, binomialTransformOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      values: ["1", "1", "1", "1"],
    })).toEqual({ ok: true, output: {
      values: ["1", "2", "4", "8"],
    } });
    expect(tool.execute({
      values: ["1", "-1", "1"],
    })).toEqual({ ok: true, output: {
      values: ["1", "0", "0"],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      values: [],
    })).toEqual({ ok: true, output: {
      values: [],
    } });
    expect(tool.execute({
      values: ["0"],
    })).toEqual({ ok: true, output: {
      values: ["0"],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({
      values: ["1", "2", "3", "4"],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      values: ["1", "2.0"],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.1", code: "invalid_format" }] } });
  });

});
