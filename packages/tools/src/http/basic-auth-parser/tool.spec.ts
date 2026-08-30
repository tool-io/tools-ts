import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runBasicAuthParser, basicAuthParserTool, basicAuthParserInputSchema, basicAuthParserOutputSchema } from "./index.js";
describe("HTTP Basic Authentication Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(basicAuthParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, basicAuthParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, basicAuthParserOutputSchema)).toBe(true);
    expect(runBasicAuthParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runBasicAuthParser({"header":"Basic YTpiOmM="})).toEqual({ok: true, output: {"usernameBytes":[97],"passwordBytes":[98,58,99]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runBasicAuthParser({"header":"Basic YQ=="});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_credentials"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runBasicAuthParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
