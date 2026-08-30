import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runVariableParser, variableParserTool, variableParserInputSchema, variableParserOutputSchema } from "./index.js";
describe("CSS Custom Property Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(variableParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, variableParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, variableParserOutputSchema)).toBe(true);
    expect(runVariableParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runVariableParser({"declarations":"color: red"})).toEqual({ok: true, output: {"variables":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runVariableParser({"declarations":"--x: calc(1px + 2px;"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "declarations", code: "malformed_css"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runVariableParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
