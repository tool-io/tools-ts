import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, anchorDownloadFilenameAttrInputSchema, anchorDownloadFilenameAttrOutputSchema } from "./index.js";
describe("html/anchor-download-filename-attr", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, anchorDownloadFilenameAttrInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, anchorDownloadFilenameAttrOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "filename": "r\u00e9sum\u00e9.pdf"
})).toEqual({ ok: true, output: {
  "attribute": "download=\"r\u00e9sum\u00e9.pdf\"",
  "hasSuggestedFilename": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "filename": ""
})).toEqual({ ok: true, output: {
  "attribute": "download=\"\"",
  "hasSuggestedFilename": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "filename", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "filename": "x\ny"
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "filename", code: "invalid_format" }] } });
  });

});
