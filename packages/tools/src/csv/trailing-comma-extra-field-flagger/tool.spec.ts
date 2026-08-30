import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, trailingCommaExtraFieldFlaggerInputSchema, trailingCommaExtraFieldFlaggerOutputSchema } from "./index.js";
describe("csv/trailing-comma-extra-field-flagger", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, trailingCommaExtraFieldFlaggerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, trailingCommaExtraFieldFlaggerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "\"x,\"",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "recordIndices": []
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": ",",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "recordIndices": [
        0
      ]
    } });
    expect(tool.execute({
      "csv": "",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "recordIndices": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
