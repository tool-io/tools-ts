import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, doubledQuoteEscapeValidatorInputSchema, doubledQuoteEscapeValidatorOutputSchema } from "./index.js";
describe("csv/doubled-quote-escape-validator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, doubledQuoteEscapeValidatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, doubledQuoteEscapeValidatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "token": "\"a\"b\""
    })).toEqual({ ok: true, output: {
      "valid": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "token": "\"\""
    })).toEqual({ ok: true, output: {
      "valid": true
    } });
    expect(tool.execute({
      "token": "\""
    })).toEqual({ ok: true, output: {
      "valid": false
    } });
    expect(tool.execute({
      "token": "\"a\",\"b\""
    })).toEqual({ ok: true, output: {
      "valid": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "token", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
