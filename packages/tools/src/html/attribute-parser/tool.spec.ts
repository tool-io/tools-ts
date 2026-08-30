import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runAttributeParser, attributeParserTool, attributeParserInputSchema, attributeParserOutputSchema } from "./index.js";
describe("HTML Attribute Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(attributeParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, attributeParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, attributeParserOutputSchema)).toBe(true);
    expect(runAttributeParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runAttributeParser({"tag":"<a href=x href=y>"})).toEqual({ok: true, output: {"name":"a","attributes":[{"name":"href","value":"x"}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runAttributeParser({"tag":"<a href=\"broken>"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "tag", code: "malformed_tag"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runAttributeParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
