import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runIntegrityAttributeParser, integrityAttributeParserTool, integrityAttributeParserInputSchema, integrityAttributeParserOutputSchema } from "./index.js";
describe("Integrity Attribute Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(integrityAttributeParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, integrityAttributeParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, integrityAttributeParserOutputSchema)).toBe(true);
    expect(runIntegrityAttributeParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runIntegrityAttributeParser({"integrity":""})).toEqual({ok: true, output: {"metadata":[],"ignored":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runIntegrityAttributeParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
