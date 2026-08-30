import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, vennTwoSetRegionMapperInputSchema, vennTwoSetRegionMapperOutputSchema } from "./index.js";
describe("logic/venn-two-set-region-mapper", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, vennTwoSetRegionMapperInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, vennTwoSetRegionMapperOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "inA": true,
      "inB": false
    })).toEqual({ ok: true, output: {
      "regionIndex": 2,
      "region": "a-only"
    } });
    expect(tool.execute({
      "inA": false,
      "inB": true
    })).toEqual({ ok: true, output: {
      "regionIndex": 1,
      "region": "b-only"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "inA": false,
      "inB": false
    })).toEqual({ ok: true, output: {
      "regionIndex": 0,
      "region": "outside"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "inA", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("validates every required field without mutating the example", () => {
    for (const field of ["inA", "inB"] as const) {
      const missing: Partial<typeof example.input> = { ...example.input };
      delete missing[field];
      expect(tool.execute(missing)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field, code: "invalid_type" }] } });
    }
    const before = JSON.stringify(example.input);
    tool.execute(example.input);
    expect(JSON.stringify(example.input)).toBe(before);
  });
});
