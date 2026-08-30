import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, mixedHeaderCaseConflictCheckerInputSchema, mixedHeaderCaseConflictCheckerOutputSchema } from "./index.js";
describe("csv/mixed-header-case-conflict-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, mixedHeaderCaseConflictCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, mixedHeaderCaseConflictCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "headers": [
        "ZIP",
        "Zip",
        "zip"
      ]
    })).toEqual({ ok: true, output: {
      "conflicts": [
        {
          "folded": "zip",
          "indices": [
            0,
            1,
            2
          ]
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "headers": []
    })).toEqual({ ok: true, output: {
      "conflicts": []
    } });
    expect(tool.execute({
      "headers": [
        "Name",
        " name"
      ]
    })).toEqual({ ok: true, output: {
      "conflicts": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "headers", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
