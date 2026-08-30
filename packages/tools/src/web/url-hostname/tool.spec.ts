import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlHostname, urlHostnameTool, urlHostnameInputSchema, urlHostnameOutputSchema } from "./index.js";
describe("URL Hostname", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlHostnameTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlHostnameInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlHostnameOutputSchema)).toBe(true);
    expect(runUrlHostname(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlHostname({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"hostname":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlHostname({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlHostname(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
