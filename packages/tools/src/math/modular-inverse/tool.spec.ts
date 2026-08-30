import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, modularInverseInputSchema, modularInverseOutputSchema } from "./index.js";

describe("math/modular-inverse", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, modularInverseInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, modularInverseOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      value: "-3",
      modulus: "11",
    })).toEqual({ ok: true, output: {
      inverse: "7",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      value: "1",
      modulus: "2",
    })).toEqual({ ok: true, output: {
      inverse: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "value", code: "invalid_type" }] } });
    expect(tool.execute({
      value: "17",
      modulus: "43",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      value: "6",
      modulus: "9",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "value", code: "not_invertible" }] } });
    expect(tool.execute({
      value: "1",
      modulus: "1",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "modulus", code: "invalid_modulus" }] } });
    expect(tool.execute({
      value: "0",
      modulus: "2",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "value", code: "not_invertible" }] } });
  });

});
