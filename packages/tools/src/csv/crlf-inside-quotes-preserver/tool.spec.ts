import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, crlfInsideQuotesPreserverInputSchema, crlfInsideQuotesPreserverOutputSchema } from "./index.js";
describe("csv/crlf-inside-quotes-preserver", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, crlfInsideQuotesPreserverInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, crlfInsideQuotesPreserverOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "\"a\nb\",c\nx,y",
      "delimiter": ",",
      "recordEnding": "CRLF"
    })).toEqual({ ok: true, output: {
      "csv": "\"a\nb\",c\r\nx,y"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "\n",
      "delimiter": ",",
      "recordEnding": "CRLF"
    })).toEqual({ ok: true, output: {
      "csv": "\r\n"
    } });
    expect(tool.execute({
      "csv": "",
      "delimiter": ",",
      "recordEnding": "LF"
    })).toEqual({ ok: true, output: {
      "csv": ""
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("is idempotent and preserves quoted CRLF", () => {
    const first = tool.execute(example.input);
    if (!first.ok) throw new Error("Expected normalized record endings.");
    expect(first.output.csv).toContain("x\r\ny");
    expect(tool.execute({ ...example.input, csv: first.output.csv })).toEqual(first);
  });
});
