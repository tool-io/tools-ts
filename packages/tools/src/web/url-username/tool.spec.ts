import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlUsername, urlUsernameTool, urlUsernameInputSchema, urlUsernameOutputSchema } from "./index.js";
describe("URL Username", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlUsernameTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlUsernameInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlUsernameOutputSchema)).toBe(true);
    expect(runUrlUsername(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlUsername({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"username":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlUsername({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlUsername(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
