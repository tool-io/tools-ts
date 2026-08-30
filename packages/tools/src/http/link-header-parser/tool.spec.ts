import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runLinkHeaderParser, linkHeaderParserTool, linkHeaderParserInputSchema, linkHeaderParserOutputSchema } from "./index.js";
describe("HTTP Link Header Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(linkHeaderParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, linkHeaderParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, linkHeaderParserOutputSchema)).toBe(true);
    expect(runLinkHeaderParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runLinkHeaderParser({"header":""})).toEqual({ok: true, output: {"links":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runLinkHeaderParser({"header":"/next; rel=next"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_header"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runLinkHeaderParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
