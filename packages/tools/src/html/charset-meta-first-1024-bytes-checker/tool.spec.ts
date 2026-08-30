import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, charsetMetaFirst1024BytesCheckerInputSchema, charsetMetaFirst1024BytesCheckerOutputSchema } from "./index.js";
describe("html/charset-meta-first-1024-bytes-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, charsetMetaFirst1024BytesCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, charsetMetaFirst1024BytesCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "charset": "utf-8",
  "tagEndByteExclusive": 1025
})).toEqual({ ok: true, output: {
  "utf8": true,
  "withinFirst1024": false,
  "passes": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "charset": "utf-8",
  "tagEndByteExclusive": 1024
})).toEqual({ ok: true, output: {
  "utf8": true,
  "withinFirst1024": true,
  "passes": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "charset", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
