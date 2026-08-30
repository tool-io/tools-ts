import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, orphanRowsParentKeyMissingFinderInputSchema, orphanRowsParentKeyMissingFinderOutputSchema } from "./index.js";
describe("csv/orphan-rows-parent-key-missing-finder", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, orphanRowsParentKeyMissingFinderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, orphanRowsParentKeyMissingFinderOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "001\n1",
      "delimiter": ",",
      "hasHeader": false,
      "column": 0,
      "parentKeys": [
        "1"
      ]
    })).toEqual({ ok: true, output: {
      "csv": "001",
      "recordIndices": [
        0
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "h",
      "delimiter": ",",
      "hasHeader": true,
      "column": 0,
      "parentKeys": []
    })).toEqual({ ok: true, output: {
      "csv": "h",
      "recordIndices": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
