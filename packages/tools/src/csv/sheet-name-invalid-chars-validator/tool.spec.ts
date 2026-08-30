import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sheetNameInvalidCharsValidatorInputSchema, sheetNameInvalidCharsValidatorOutputSchema } from "./index.js";
describe("csv/sheet-name-invalid-chars-validator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sheetNameInvalidCharsValidatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sheetNameInvalidCharsValidatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "name": "Ada's Sales"
    })).toEqual({ ok: true, output: {
      "valid": true,
      "reasons": []
    } });
    expect(tool.execute({
      "name": "History"
    })).toEqual({ ok: true, output: {
      "valid": false,
      "reasons": [
        "reserved_name"
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "name": ""
    })).toEqual({ ok: true, output: {
      "valid": false,
      "reasons": [
        "empty_name"
      ]
    } });
    expect(tool.execute({
      "name": "1234567890123456789012345678901"
    })).toEqual({ ok: true, output: {
      "valid": true,
      "reasons": []
    } });
    expect(tool.execute({
      "name": "'Sales"
    })).toEqual({ ok: true, output: {
      "valid": false,
      "reasons": [
        "boundary_apostrophe"
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "name", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
