import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runRegisterFieldEncode, registerFieldEncodeTool, registerFieldEncodeInputSchema, registerFieldEncodeOutputSchema } from "./index.js";
describe("Register Field Encoder", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(registerFieldEncodeTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, registerFieldEncodeInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, registerFieldEncodeOutputSchema)).toBe(true);
    expect(runRegisterFieldEncode(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runRegisterFieldEncode({"register":4294967295,"offset":0,"width":32,"value":0})).toEqual({ok: true, output: {"register":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runRegisterFieldEncode({"register":0,"offset":31,"width":2,"value":1});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "width", code: "field_out_of_range"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runRegisterFieldEncode(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
