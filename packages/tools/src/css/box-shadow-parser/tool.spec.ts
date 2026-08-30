import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runBoxShadowParser, boxShadowParserTool, boxShadowParserInputSchema, boxShadowParserOutputSchema } from "./index.js";
describe("CSS Box Shadow Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(boxShadowParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, boxShadowParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, boxShadowParserOutputSchema)).toBe(true);
    expect(runBoxShadowParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runBoxShadowParser({"value":"none"})).toEqual({ok: true, output: {"shadows":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runBoxShadowParser({"value":"0 0 -1px red"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "value", code: "invalid_blur"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runBoxShadowParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
