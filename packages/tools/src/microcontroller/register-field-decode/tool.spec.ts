import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runRegisterFieldDecode, registerFieldDecodeTool, registerFieldDecodeInputSchema, registerFieldDecodeOutputSchema } from "./index.js";
describe("Register Field Decoder", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(registerFieldDecodeTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, registerFieldDecodeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, registerFieldDecodeOutputSchema)).toBe(true);
    expect(runRegisterFieldDecode(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runRegisterFieldDecode({"register":4294967295,"offset":0,"width":32})).toEqual({ok: true, output: {"value":4294967295}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runRegisterFieldDecode({"register":0,"offset":31,"width":2});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "width", code: "field_out_of_range"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runRegisterFieldDecode(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
