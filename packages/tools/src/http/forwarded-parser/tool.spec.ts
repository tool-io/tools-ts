import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runForwardedParser, forwardedParserTool, forwardedParserInputSchema, forwardedParserOutputSchema } from "./index.js";
describe("HTTP Forwarded Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(forwardedParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, forwardedParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, forwardedParserOutputSchema)).toBe(true);
    expect(runForwardedParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runForwardedParser({"header":"for=unknown;by=_proxy"})).toEqual({ok: true, output: {"elements":[[{"name":"for","value":"unknown"},{"name":"by","value":"_proxy"}]]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runForwardedParser({"header":"for=a;for=b"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_header"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runForwardedParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
