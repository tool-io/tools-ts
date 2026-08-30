import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, imgDecodingAsyncSyncAutoHintInputSchema, imgDecodingAsyncSyncAutoHintOutputSchema } from "./index.js";
describe("html/img-decoding-async-sync-auto-hint", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, imgDecodingAsyncSyncAutoHintInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, imgDecodingAsyncSyncAutoHintOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "present": true,
  "value": "invalid"
})).toEqual({ ok: true, output: {
  "state": "auto",
  "validKeyword": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "present": false,
  "value": ""
})).toEqual({ ok: true, output: {
  "state": "auto",
  "validKeyword": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "present", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
