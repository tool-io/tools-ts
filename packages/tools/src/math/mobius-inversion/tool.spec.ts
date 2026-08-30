import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, mobiusInversionInputSchema, mobiusInversionOutputSchema } from "./index.js";

describe("math/mobius-inversion", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, mobiusInversionInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, mobiusInversionOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      divisorSums: ["1", "3", "4", "7", "6", "12"],
    })).toEqual({ ok: true, output: {
      values: ["1", "2", "3", "4", "5", "6"],
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      divisorSums: [],
    })).toEqual({ ok: true, output: {
      values: [],
    } });
    expect(tool.execute({
      divisorSums: ["-3"],
    })).toEqual({ ok: true, output: {
      values: ["-3"],
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "divisorSums", code: "invalid_type" }] } });
    expect(tool.execute({
      divisorSums: ["1", "2", "3", "4", "5", "6"],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
