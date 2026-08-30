import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, latin1ExportCompatibilityWarningInputSchema, latin1ExportCompatibilityWarningOutputSchema } from "./index.js";
describe("csv/latin1-export-compatibility-warning", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, latin1ExportCompatibilityWarningInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, latin1ExportCompatibilityWarningOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "ÿ",
        ""
      ]
    })).toEqual({ ok: true, output: {
      "compatible": true,
      "incompatibleIndices": []
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": []
    })).toEqual({ ok: true, output: {
      "compatible": true,
      "incompatibleIndices": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
