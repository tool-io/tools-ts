import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, insetShorthandAllFourOffsetsInputSchema, insetShorthandAllFourOffsetsOutputSchema } from "./index.js";
describe("css/inset-shorthand-all-four-offsets", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, insetShorthandAllFourOffsetsInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, insetShorthandAllFourOffsetsOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        1,
        2,
        3,
        4
      ]
    })).toEqual({ ok: true, output: {
      "top": 1,
      "right": 2,
      "bottom": 3,
      "left": 4
    } });
    expect(tool.execute({
      "values": [
        5
      ]
    })).toEqual({ ok: true, output: {
      "top": 5,
      "right": 5,
      "bottom": 5,
      "left": 5
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": [
        -2,
        0
      ]
    })).toEqual({ ok: true, output: {
      "top": -2,
      "right": 0,
      "bottom": -2,
      "left": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "values": []
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "out_of_range" }] } });
    expect(tool.execute({
      "values": [
        1,
        2,
        3,
        4,
        5
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "resource_limit" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["values"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
