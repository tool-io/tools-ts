import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, lineCountVsRecordCountReconcilerInputSchema, lineCountVsRecordCountReconcilerOutputSchema } from "./index.js";
describe("csv/line-count-vs-record-count-reconciler", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, lineCountVsRecordCountReconcilerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, lineCountVsRecordCountReconcilerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a,b\r\nc,d",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "physicalLineCount": 2,
      "recordCount": 2,
      "embeddedBreakCount": 0
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "physicalLineCount": 0,
      "recordCount": 0,
      "embeddedBreakCount": 0
    } });
    expect(tool.execute({
      "csv": "\n\n",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "physicalLineCount": 2,
      "recordCount": 2,
      "embeddedBreakCount": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
