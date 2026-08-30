import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, encodingUtf16BomCheckerInputSchema, encodingUtf16BomCheckerOutputSchema } from "./index.js";
describe("csv/encoding-utf16-bom-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, encodingUtf16BomCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, encodingUtf16BomCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "bytes": [
        254,
        255,
        0,
        65
      ]
    })).toEqual({ ok: true, output: {
      "encodingHint": "utf16-be",
      "ambiguous": false
    } });
    expect(tool.execute({
      "bytes": [
        255,
        254,
        0,
        0
      ]
    })).toEqual({ ok: true, output: {
      "encodingHint": "utf32-le",
      "ambiguous": true
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "bytes": [
        255
      ]
    })).toEqual({ ok: true, output: {
      "encodingHint": "unknown",
      "ambiguous": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "bytes", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
