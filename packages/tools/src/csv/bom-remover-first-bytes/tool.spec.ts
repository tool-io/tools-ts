import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, bomRemoverFirstBytesInputSchema, bomRemoverFirstBytesOutputSchema } from "./index.js";
describe("csv/bom-remover-first-bytes", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, bomRemoverFirstBytesInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, bomRemoverFirstBytesOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "bytes": [
        255,
        254,
        65,
        0
      ]
    })).toEqual({ ok: true, output: {
      "bytes": [
        255,
        254,
        65,
        0
      ],
      "removed": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "bytes": []
    })).toEqual({ ok: true, output: {
      "bytes": [],
      "removed": false
    } });
    expect(tool.execute({
      "bytes": [
        239,
        187,
        191,
        239,
        187,
        191
      ]
    })).toEqual({ ok: true, output: {
      "bytes": [
        239,
        187,
        191
      ],
      "removed": true
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "bytes", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
