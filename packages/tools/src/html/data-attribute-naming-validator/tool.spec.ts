import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dataAttributeNamingValidatorInputSchema, dataAttributeNamingValidatorOutputSchema } from "./index.js";
describe("html/data-attribute-naming-validator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dataAttributeNamingValidatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dataAttributeNamingValidatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "name": "data-User"
})).toEqual({ ok: true, output: {
  "valid": false,
  "datasetKey": ""
} });
    expect(tool.execute({
  "name": "data-1.\u00e9"
})).toEqual({ ok: true, output: {
  "valid": true,
  "datasetKey": "1.\u00e9"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "name": "data-"
})).toEqual({ ok: true, output: {
  "valid": false,
  "datasetKey": ""
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "name", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
