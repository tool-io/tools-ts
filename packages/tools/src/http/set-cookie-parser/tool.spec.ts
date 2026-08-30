import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSetCookieParser, setCookieParserTool, setCookieParserInputSchema, setCookieParserOutputSchema } from "./index.js";
describe("HTTP Set-Cookie Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(setCookieParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, setCookieParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, setCookieParserOutputSchema)).toBe(true);
    expect(runSetCookieParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSetCookieParser({"header":"a=b; Expires=Wed, 21 Oct 2015 07:28:00 GMT"})).toEqual({ok: true, output: {"name":"a","value":"b","attributes":[{"name":"expires","value":"Wed, 21 Oct 2015 07:28:00 GMT"}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSetCookieParser({"header":"a=b\r\nX: y"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_cookie"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSetCookieParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
