import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, cellCoordinateParserA1InputSchema, cellCoordinateParserA1OutputSchema } from "./index.js";
describe("csv/cell-coordinate-parser-a1", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, cellCoordinateParserA1InputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cellCoordinateParserA1OutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "address": "AA7"
    })).toEqual({ ok: true, output: {
      "row": 7,
      "column": 27,
      "absoluteRow": false,
      "absoluteColumn": false,
      "canonical": "AA7"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "address": "A1"
    })).toEqual({ ok: true, output: {
      "row": 1,
      "column": 1,
      "absoluteRow": false,
      "absoluteColumn": false,
      "canonical": "A1"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "address", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "address": "A0"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "address", code: "invalid_address" }] } });
    expect(tool.execute({
      "address": "A9007199254740992"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "address", code: "invalid_address" }] } });
  });

});
