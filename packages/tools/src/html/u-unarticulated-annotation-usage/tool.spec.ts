import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, uUnarticulatedAnnotationUsageInputSchema, uUnarticulatedAnnotationUsageOutputSchema } from "./index.js";
describe("html/u-unarticulated-annotation-usage", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, uUnarticulatedAnnotationUsageInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, uUnarticulatedAnnotationUsageOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tags": [
    "ins"
  ]
})).toEqual({ ok: true, output: {
  "unarticulatedAnnotation": [
    false
  ],
  "annotationCount": 0
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "tags": []
})).toEqual({ ok: true, output: {
  "unarticulatedAnnotation": [],
  "annotationCount": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tags", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
