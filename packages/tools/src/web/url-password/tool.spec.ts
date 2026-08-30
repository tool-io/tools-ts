import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlPassword, urlPasswordTool, urlPasswordInputSchema, urlPasswordOutputSchema } from "./index.js";
describe("URL Password", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlPasswordTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlPasswordInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlPasswordOutputSchema)).toBe(true);
    expect(runUrlPassword(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlPassword({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"password":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlPassword({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlPassword(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
