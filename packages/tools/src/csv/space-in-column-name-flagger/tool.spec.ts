import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, spaceInColumnNameFlaggerInputSchema, spaceInColumnNameFlaggerOutputSchema } from "./index.js";
describe("csv/space-in-column-name-flagger", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, spaceInColumnNameFlaggerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, spaceInColumnNameFlaggerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "headers": [
        "a\tb",
        "a b"
      ]
    })).toEqual({ ok: true, output: {
      "indices": []
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "headers": []
    })).toEqual({ ok: true, output: {
      "indices": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "headers", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
