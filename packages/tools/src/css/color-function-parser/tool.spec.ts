import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runColorFunctionParser, colorFunctionParserTool, colorFunctionParserInputSchema, colorFunctionParserOutputSchema } from "./index.js";
describe("CSS Color Function Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(colorFunctionParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, colorFunctionParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, colorFunctionParserOutputSchema)).toBe(true);
    expect(runColorFunctionParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runColorFunctionParser({"value":"hsl(120, 50%, 25%)"})).toEqual({ok: true, output: {"function":"hsl","channels":["120","50%","25%"],"alpha":"1"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runColorFunctionParser({"value":"rgb(1 2)"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "value", code: "malformed_css"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runColorFunctionParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
