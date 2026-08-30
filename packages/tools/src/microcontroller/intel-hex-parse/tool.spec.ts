import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runIntelHexParse, intelHexParseTool, intelHexParseInputSchema, intelHexParseOutputSchema } from "./index.js";
describe("Intel HEX Record Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(intelHexParseTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, intelHexParseInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, intelHexParseOutputSchema)).toBe(true);
    expect(runIntelHexParse(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runIntelHexParse({"line":":00000001FF"})).toEqual({ok: true, output: {"recordType":1,"address":0,"data":[],"checksum":255}}));
  it("matches independent case 2", () => expect(runIntelHexParse({"line":":020000040001F9"})).toEqual({ok: true, output: {"recordType":4,"address":0,"data":[0,1],"checksum":249}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runIntelHexParse({"line":":0401000001020304F0"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "line", code: "invalid_checksum"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runIntelHexParse(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
