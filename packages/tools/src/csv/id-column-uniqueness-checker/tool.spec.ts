import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, idColumnUniquenessCheckerInputSchema, idColumnUniquenessCheckerOutputSchema } from "./index.js";
describe("csv/id-column-uniqueness-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, idColumnUniquenessCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, idColumnUniquenessCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "",
        ""
      ]
    })).toEqual({ ok: true, output: {
      "unique": false,
      "distinctCount": 1,
      "duplicateIndices": [
        1
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": []
    })).toEqual({ ok: true, output: {
      "unique": true,
      "distinctCount": 0,
      "duplicateIndices": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
