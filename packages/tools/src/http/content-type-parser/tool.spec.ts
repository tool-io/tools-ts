import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runContentTypeParser, contentTypeParserTool, contentTypeParserInputSchema, contentTypeParserOutputSchema } from "./index.js";
describe("HTTP Content-Type Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(contentTypeParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, contentTypeParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, contentTypeParserOutputSchema)).toBe(true);
    expect(runContentTypeParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runContentTypeParser({"header":"application/json"})).toEqual({ok: true, output: {"mediaType":"application/json","parameters":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runContentTypeParser({"header":"text/plain; charset=a; charset=b"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_header"});
  });
  it("reports invalid case 2 at its input field", () => {
    const result = runContentTypeParser({"header":"text/plain\r\nInjected: yes"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_header"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runContentTypeParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
