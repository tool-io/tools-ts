import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSetCookieSerializer, setCookieSerializerTool, setCookieSerializerInputSchema, setCookieSerializerOutputSchema } from "./index.js";
describe("HTTP Set-Cookie Serializer", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(setCookieSerializerTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, setCookieSerializerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, setCookieSerializerOutputSchema)).toBe(true);
    expect(runSetCookieSerializer(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSetCookieSerializer({"name":"a","value":"","attributes":[]})).toEqual({ok: true, output: {"header":"a="}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSetCookieSerializer({"name":"a","value":"b","attributes":[{"name":"path","value":"/; bad"}]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "attributes", code: "malformed_cookie"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSetCookieSerializer(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
