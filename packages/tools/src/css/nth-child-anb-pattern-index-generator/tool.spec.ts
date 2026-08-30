import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, nthChildAnbPatternIndexGeneratorInputSchema, nthChildAnbPatternIndexGeneratorOutputSchema } from "./index.js";
describe("css/nth-child-anb-pattern-index-generator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, nthChildAnbPatternIndexGeneratorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, nthChildAnbPatternIndexGeneratorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "a": -2,
      "b": 5,
      "limit": 7
    })).toEqual({ ok: true, output: {
      "indices": [
        1,
        3,
        5
      ]
    } });
    expect(tool.execute({
      "a": 0,
      "b": 3,
      "limit": 5
    })).toEqual({ ok: true, output: {
      "indices": [
        3
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "a": 0,
      "b": 0,
      "limit": 5
    })).toEqual({ ok: true, output: {
      "indices": []
    } });
    expect(tool.execute({
      "a": 2,
      "b": -1,
      "limit": 5
    })).toEqual({ ok: true, output: {
      "indices": [
        1,
        3,
        5
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "a", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
