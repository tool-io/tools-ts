import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, audioPreloadMetadataNoneAutoValuesInputSchema, audioPreloadMetadataNoneAutoValuesOutputSchema } from "./index.js";
describe("html/audio-preload-metadata-none-auto-values", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, audioPreloadMetadataNoneAutoValuesInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, audioPreloadMetadataNoneAutoValuesOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "present": true,
  "value": ""
})).toEqual({ ok: true, output: {
  "state": "auto",
  "validKeyword": true
} });
    expect(tool.execute({
  "present": true,
  "value": "bogus"
})).toEqual({ ok: true, output: {
  "state": "implementation-defined",
  "validKeyword": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "present": false,
  "value": ""
})).toEqual({ ok: true, output: {
  "state": "implementation-defined",
  "validKeyword": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "present", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
