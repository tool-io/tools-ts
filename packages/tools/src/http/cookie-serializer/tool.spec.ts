import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCookieSerializer, cookieSerializerTool, cookieSerializerInputSchema, cookieSerializerOutputSchema } from "./index.js";
describe("HTTP Cookie Serializer", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(cookieSerializerTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, cookieSerializerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cookieSerializerOutputSchema)).toBe(true);
    expect(runCookieSerializer(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCookieSerializer({"cookies":[]})).toEqual({ok: true, output: {"header":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runCookieSerializer({"cookies":[{"name":"a","value":"b;c"}]});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "cookies", code: "malformed_cookie"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runCookieSerializer(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
