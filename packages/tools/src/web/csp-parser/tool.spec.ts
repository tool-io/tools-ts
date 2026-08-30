import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCspParser, cspParserTool, cspParserInputSchema, cspParserOutputSchema } from "./index.js";
describe("Content Security Policy Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(cspParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, cspParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cspParserOutputSchema)).toBe(true);
    expect(runCspParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCspParser({"policy":"upgrade-insecure-requests;"})).toEqual({ok: true, output: {"directives":[{"name":"upgrade-insecure-requests","values":[]}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runCspParser({"policy":"default-src a\r\nX:y"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "policy", code: "malformed_policy"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runCspParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
