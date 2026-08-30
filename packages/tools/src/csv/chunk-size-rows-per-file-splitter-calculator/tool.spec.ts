import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, chunkSizeRowsPerFileSplitterCalculatorInputSchema, chunkSizeRowsPerFileSplitterCalculatorOutputSchema } from "./index.js";
describe("csv/chunk-size-rows-per-file-splitter-calculator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, chunkSizeRowsPerFileSplitterCalculatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, chunkSizeRowsPerFileSplitterCalculatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "totalDataRows": 1000,
      "maxDataRowsPerFile": 500
    })).toEqual({ ok: true, output: {
      "fileCount": 2,
      "lastFileRows": 500
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "totalDataRows": 0,
      "maxDataRowsPerFile": 500
    })).toEqual({ ok: true, output: {
      "fileCount": 0,
      "lastFileRows": 0
    } });
    expect(tool.execute({
      "totalDataRows": 9007199254740991,
      "maxDataRowsPerFile": 2
    })).toEqual({ ok: true, output: {
      "fileCount": 4503599627370496,
      "lastFileRows": 1
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "totalDataRows", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "totalDataRows": 10,
      "maxDataRowsPerFile": 0
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "maxDataRowsPerFile", code: "out_of_range" }] } });
  });

});
