import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, rfc4180QuotedFieldParserCheckInputSchema, rfc4180QuotedFieldParserCheckOutputSchema } from "./index.js";
describe("csv/rfc4180-quoted-field-parser-check", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, rfc4180QuotedFieldParserCheckInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, rfc4180QuotedFieldParserCheckOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "\"a\"\"b\",c",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": true,
      "recordCount": 1,
      "fieldCount": 2,
      "errorOffset": -1,
      "errorCode": ""
    } });
    expect(tool.execute({
      "csv": "\"a\"x",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": false,
      "recordCount": 0,
      "fieldCount": 0,
      "errorOffset": 3,
      "errorCode": "invalid_csv"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": true,
      "recordCount": 0,
      "fieldCount": 0,
      "errorOffset": -1,
      "errorCode": ""
    } });
    expect(tool.execute({
      "csv": "\"\"",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": true,
      "recordCount": 1,
      "fieldCount": 1,
      "errorOffset": -1,
      "errorCode": ""
    } });
    expect(tool.execute({
      "csv": ",",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": true,
      "recordCount": 1,
      "fieldCount": 2,
      "errorOffset": -1,
      "errorCode": ""
    } });
    expect(tool.execute({
      "csv": "\n\n",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": true,
      "recordCount": 2,
      "fieldCount": 2,
      "errorOffset": -1,
      "errorCode": ""
    } });
    expect(tool.execute({
      "csv": "a,b\r\n",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": true,
      "recordCount": 1,
      "fieldCount": 2,
      "errorOffset": -1,
      "errorCode": ""
    } });
    expect(tool.execute({
      "csv": "a\"b",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": false,
      "recordCount": 0,
      "fieldCount": 0,
      "errorOffset": 1,
      "errorCode": "invalid_csv"
    } });
    expect(tool.execute({
      "csv": "\"a",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "valid": false,
      "recordCount": 0,
      "fieldCount": 0,
      "errorOffset": 2,
      "errorCode": "invalid_csv"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, csv: "x".repeat(100001) })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "resource_limit" }] } });
    expect(tool.execute({ ...example.input, csv: ",".repeat(10000) })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "resource_limit" }] } });
  });
  it("does not mutate the public input", () => {
    const value = Object.freeze({ ...example.input });
    expect(tool.execute(value)).toEqual({ ok: true, output: example.output });
  });
  it("accepts the inclusive field-resource boundary", () => {
    expect(tool.execute({ csv: ",".repeat(9999), delimiter: "," })).toEqual({ ok: true, output: { valid: true, recordCount: 1, fieldCount: 10000, errorOffset: -1, errorCode: "" } });
  });
});
