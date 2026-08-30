import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, uniqueRowsDedupeFirstOccurrenceInputSchema, uniqueRowsDedupeFirstOccurrenceOutputSchema } from "./index.js";
describe("csv/unique-rows-dedupe-first-occurrence", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, uniqueRowsDedupeFirstOccurrenceInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, uniqueRowsDedupeFirstOccurrenceOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "\"a,b\",c\na,\"b,c\"",
      "delimiter": ",",
      "hasHeader": false
    })).toEqual({ ok: true, output: {
      "csv": "\"a,b\",c\na,\"b,c\"",
      "removedCount": 0
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "\n\n",
      "delimiter": ",",
      "hasHeader": false
    })).toEqual({ ok: true, output: {
      "csv": "\"\"",
      "removedCount": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("is idempotent after the first pass", () => {
    const first = tool.execute(example.input);
    if (!first.ok) throw new Error("Expected deduplicated CSV.");
    expect(tool.execute({ ...example.input, csv: first.output.csv })).toEqual({ ok: true, output: { csv: first.output.csv, removedCount: 0 } });
  });
});
