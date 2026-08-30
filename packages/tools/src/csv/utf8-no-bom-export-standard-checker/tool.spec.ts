import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, utf8NoBomExportStandardCheckerInputSchema, utf8NoBomExportStandardCheckerOutputSchema } from "./index.js";
describe("csv/utf8-no-bom-export-standard-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, utf8NoBomExportStandardCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, utf8NoBomExportStandardCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "bytes": [
        239,
        187,
        191,
        65
      ]
    })).toEqual({ ok: true, output: {
      "validUtf8": true,
      "hasBom": true,
      "conforms": false,
      "errorOffset": -1
    } });
    expect(tool.execute({
      "bytes": [
        244,
        143,
        191,
        191
      ]
    })).toEqual({ ok: true, output: {
      "validUtf8": true,
      "hasBom": false,
      "conforms": true,
      "errorOffset": -1
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "bytes": []
    })).toEqual({ ok: true, output: {
      "validUtf8": true,
      "hasBom": false,
      "conforms": true,
      "errorOffset": -1
    } });
    expect(tool.execute({
      "bytes": [
        192,
        128
      ]
    })).toEqual({ ok: true, output: {
      "validUtf8": false,
      "hasBom": false,
      "conforms": false,
      "errorOffset": 0
    } });
    expect(tool.execute({
      "bytes": [
        237,
        160,
        128
      ]
    })).toEqual({ ok: true, output: {
      "validUtf8": false,
      "hasBom": false,
      "conforms": false,
      "errorOffset": 0
    } });
    expect(tool.execute({
      "bytes": [
        240,
        159,
        146
      ]
    })).toEqual({ ok: true, output: {
      "validUtf8": false,
      "hasBom": false,
      "conforms": false,
      "errorOffset": 0
    } });
    expect(tool.execute({
      "bytes": [
        244,
        144,
        128,
        128
      ]
    })).toEqual({ ok: true, output: {
      "validUtf8": false,
      "hasBom": false,
      "conforms": false,
      "errorOffset": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "bytes", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("reports the beginning of a malformed sequence after an ASCII prefix", () => {
    expect(tool.execute({ bytes: [65, 194, 65] })).toEqual({ ok: true, output: { validUtf8: false, hasBom: false, conforms: false, errorOffset: 1 } });
  });
});
