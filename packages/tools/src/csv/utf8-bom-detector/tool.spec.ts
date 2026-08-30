import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, utf8BomDetectorInputSchema, utf8BomDetectorOutputSchema } from "./index.js";
describe("csv/utf8-bom-detector", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, utf8BomDetectorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, utf8BomDetectorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "bytes": [
        65,
        239,
        187,
        191
      ]
    })).toEqual({ ok: true, output: {
      "hasBom": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "bytes": []
    })).toEqual({ ok: true, output: {
      "hasBom": false
    } });
    expect(tool.execute({
      "bytes": [
        239,
        187
      ]
    })).toEqual({ ok: true, output: {
      "hasBom": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "bytes", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "bytes": [
        256
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "bytes.0", code: "out_of_range" }] } });
    expect(tool.execute({ bytes: Array(3) })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "bytes.0", code: "invalid_type" }] } });
  });

});
