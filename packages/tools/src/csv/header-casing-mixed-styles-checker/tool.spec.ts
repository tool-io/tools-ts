import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, headerCasingMixedStylesCheckerInputSchema, headerCasingMixedStylesCheckerOutputSchema } from "./index.js";
describe("csv/header-casing-mixed-styles-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, headerCasingMixedStylesCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, headerCasingMixedStylesCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "headers": [
        "name",
        "age"
      ]
    })).toEqual({ ok: true, output: {
      "styles": [
        "lowercase",
        "lowercase"
      ],
      "distinctStyles": [
        "lowercase"
      ],
      "mixed": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "headers": [
        "",
        "😀"
      ]
    })).toEqual({ ok: true, output: {
      "styles": [
        "unknown",
        "unknown"
      ],
      "distinctStyles": [],
      "mixed": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "headers", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
