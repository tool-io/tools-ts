import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, ramanujanSumInputSchema, ramanujanSumOutputSchema } from "./index.js";

describe("math/ramanujan-sum", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, ramanujanSumInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, ramanujanSumOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      modulus: 5,
      frequency: "1",
    })).toEqual({ ok: true, output: {
      value: "-1",
    } });
    expect(tool.execute({
      modulus: 5,
      frequency: "0",
    })).toEqual({ ok: true, output: {
      value: "4",
    } });
    expect(tool.execute({
      modulus: 4,
      frequency: "1",
    })).toEqual({ ok: true, output: {
      value: "0",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      modulus: 1,
      frequency: "0",
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
    expect(tool.execute({
      modulus: 4,
      frequency: "2",
    })).toEqual({ ok: true, output: {
      value: "-2",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "modulus", code: "invalid_type" }] } });
    expect(tool.execute({
      modulus: 12,
      frequency: "4",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, modulus: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "modulus", code: "invalid_type" }] } });
  });

});
