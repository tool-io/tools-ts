import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sourceTypeCodecsParameterLookupInputSchema, sourceTypeCodecsParameterLookupOutputSchema } from "./index.js";
describe("html/source-type-codecs-parameter-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sourceTypeCodecsParameterLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sourceTypeCodecsParameterLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "mediaType": "AUDIO/OGG",
  "codecs": [
    "vorbis"
  ]
})).toEqual({ ok: true, output: {
  "typeValue": "audio/ogg; codecs=\"vorbis\"",
  "attribute": "type=\"audio/ogg; codecs=&quot;vorbis&quot;\""
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "mediaType", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "mediaType": "video/mp4",
  "codecs": [
    "x,y"
  ]
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "codecs.0", code: "invalid_format" }] } });
  });

  it("rejects malformed MIME and codec token endings", () => {
    expect(tool.execute({ ...example.input, mediaType: "video/mp4\n" })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "mediaType", code: "invalid_format" }] } });
    expect(tool.execute({ ...example.input, codecs: ["avc1.42E01E\n"] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "codecs.0", code: "invalid_format" }] } });
  });
});
