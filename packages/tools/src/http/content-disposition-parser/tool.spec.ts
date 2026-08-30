import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runContentDispositionParser, contentDispositionParserTool, contentDispositionParserInputSchema, contentDispositionParserOutputSchema } from "./index.js";
describe("HTTP Content-Disposition Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(contentDispositionParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, contentDispositionParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, contentDispositionParserOutputSchema)).toBe(true);
    expect(runContentDispositionParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runContentDispositionParser({"header":"inline; filename*=UTF-8''caf%C3%A9.txt"})).toEqual({ok: true, output: {"disposition":"inline","parameters":[{"name":"filename*","value":"UTF-8''caf%C3%A9.txt"}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runContentDispositionParser({"header":"attachment; filename=\"broken"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_header"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runContentDispositionParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
