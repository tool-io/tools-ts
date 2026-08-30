import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSrecParse, srecParseTool, srecParseInputSchema, srecParseOutputSchema } from "./index.js";
describe("Motorola S-Record Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(srecParseTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, srecParseInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, srecParseOutputSchema)).toBe(true);
    expect(runSrecParse(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSrecParse({"line":"S9030000FC"})).toEqual({ok: true, output: {"recordType":9,"address":0,"data":[],"checksum":252}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSrecParse({"line":"S10512340102B0"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "line", code: "invalid_checksum"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSrecParse(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
