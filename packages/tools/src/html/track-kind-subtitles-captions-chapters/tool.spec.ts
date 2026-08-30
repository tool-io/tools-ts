import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, trackKindSubtitlesCaptionsChaptersInputSchema, trackKindSubtitlesCaptionsChaptersOutputSchema } from "./index.js";
describe("html/track-kind-subtitles-captions-chapters", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, trackKindSubtitlesCaptionsChaptersInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, trackKindSubtitlesCaptionsChaptersOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "present": true,
  "value": ""
})).toEqual({ ok: true, output: {
  "state": "metadata",
  "validKeyword": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "present": false,
  "value": ""
})).toEqual({ ok: true, output: {
  "state": "subtitles",
  "validKeyword": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "present", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
