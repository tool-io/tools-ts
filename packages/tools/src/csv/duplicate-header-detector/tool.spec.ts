import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, duplicateHeaderDetectorInputSchema, duplicateHeaderDetectorOutputSchema } from "./index.js";
describe("csv/duplicate-header-detector", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, duplicateHeaderDetectorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, duplicateHeaderDetectorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "headers": [
        "id",
        "ID"
      ]
    })).toEqual({ ok: true, output: {
      "duplicates": []
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "headers": [
        "",
        ""
      ]
    })).toEqual({ ok: true, output: {
      "duplicates": [
        {
          "header": "",
          "indices": [
            0,
            1
          ]
        }
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "headers", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
