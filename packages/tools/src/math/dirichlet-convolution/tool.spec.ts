import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dirichletConvolutionInputSchema, dirichletConvolutionOutputSchema } from "./index.js";

describe("math/dirichlet-convolution", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dirichletConvolutionInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dirichletConvolutionOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      left: ["1", "1", "1", "1"],
      right: ["1", "1", "1", "1"],
    })).toEqual({ ok: true, output: {
      values: ["1", "2", "2", "3"],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      left: [],
      right: [],
    })).toEqual({ ok: true, output: {
      values: [],
    } });
    expect(tool.execute({
      left: ["-2"],
      right: ["3"],
    })).toEqual({ ok: true, output: {
      values: ["-6"],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "left", code: "invalid_type" }] } });
    expect(tool.execute({
      left: ["1", "1", "1", "1", "1", "1"],
      right: ["1", "2", "3", "4", "5", "6"],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      left: ["1"],
      right: [],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "right", code: "length_mismatch" }] } });
  });

});
