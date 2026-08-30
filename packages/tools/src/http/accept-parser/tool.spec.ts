import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runAcceptParser, acceptParserTool, acceptParserInputSchema, acceptParserOutputSchema } from "./index.js";
describe("HTTP Accept Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(acceptParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, acceptParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, acceptParserOutputSchema)).toBe(true);
    expect(runAcceptParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runAcceptParser({"header":"text/*;q=0"})).toEqual({ok: true, output: {"ranges":[{"range":"text/*","quality":0,"parameters":[]}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runAcceptParser({"header":"text/html;q=1.5"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "invalid_quality"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runAcceptParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
