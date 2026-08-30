import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, headerOffsetRecordIndexInputSchema, headerOffsetRecordIndexOutputSchema } from "./index.js";
describe("csv/header-offset-record-index", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, headerOffsetRecordIndexInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, headerOffsetRecordIndexOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "dataIndex": 4,
      "hasHeader": false
    })).toEqual({ ok: true, output: {
      "recordIndex": 4
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "dataIndex": 0,
      "hasHeader": true
    })).toEqual({ ok: true, output: {
      "recordIndex": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "dataIndex", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "dataIndex": 9007199254740991,
      "hasHeader": true
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "dataIndex", code: "index_overflow" }] } });
  });

});
