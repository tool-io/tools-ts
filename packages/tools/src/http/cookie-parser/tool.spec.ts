import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCookieParser, cookieParserTool, cookieParserInputSchema, cookieParserOutputSchema } from "./index.js";
describe("HTTP Cookie Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(cookieParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, cookieParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cookieParserOutputSchema)).toBe(true);
    expect(runCookieParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCookieParser({"header":""})).toEqual({ok: true, output: {"cookies":[]}}));
  it("matches independent case 2", () => expect(runCookieParser({"header":"a=\"b=c\""})).toEqual({ok: true, output: {"cookies":[{"name":"a","value":"b=c"}]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runCookieParser({"header":"a=bad value"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "malformed_cookie"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runCookieParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
