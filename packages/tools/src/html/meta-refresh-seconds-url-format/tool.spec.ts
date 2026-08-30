import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, metaRefreshSecondsUrlFormatInputSchema, metaRefreshSecondsUrlFormatOutputSchema } from "./index.js";
describe("html/meta-refresh-seconds-url-format", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, metaRefreshSecondsUrlFormatInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, metaRefreshSecondsUrlFormatOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "seconds": 0,
  "url": "https://example.org/"
})).toEqual({ ok: true, output: {
  "content": "0;url=https://example.org/",
  "element": "<meta http-equiv=\"refresh\" content=\"0;url=https://example.org/\">"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "seconds", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "seconds": 5,
  "url": "/next"
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "url", code: "invalid_url" }] } });
    expect(tool.execute({
  "seconds": 5,
  "url": "data:text/plain,x"
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "url", code: "invalid_scheme" }] } });
  });

});
