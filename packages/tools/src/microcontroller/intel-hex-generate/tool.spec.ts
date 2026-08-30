import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runIntelHexGenerate, intelHexGenerateTool, intelHexGenerateInputSchema, intelHexGenerateOutputSchema } from "./index.js";
describe("Intel HEX Record Generator", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(intelHexGenerateTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, intelHexGenerateInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, intelHexGenerateOutputSchema)).toBe(true);
    expect(runIntelHexGenerate(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runIntelHexGenerate({"recordType":1,"address":0,"data":[]})).toEqual({ok: true, output: {"line":":00000001FF"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runIntelHexGenerate({"recordType":1,"address":0,"data":[1]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "data", code: "invalid_record_shape"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runIntelHexGenerate(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
