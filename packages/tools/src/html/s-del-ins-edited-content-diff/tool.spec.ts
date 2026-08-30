import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sDelInsEditedContentDiffInputSchema, sDelInsEditedContentDiffOutputSchema } from "./index.js";
describe("html/s-del-ins-edited-content-diff", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sDelInsEditedContentDiffInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sDelInsEditedContentDiffOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tag": "s"
})).toEqual({ ok: true, output: {
  "meaning": "inaccurate",
  "conforming": true
} });
    expect(tool.execute({
  "tag": "ins"
})).toEqual({ ok: true, output: {
  "meaning": "insertion",
  "conforming": true
} });
    expect(tool.execute({
  "tag": "strike"
})).toEqual({ ok: true, output: {
  "meaning": "obsolete",
  "conforming": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tag", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
