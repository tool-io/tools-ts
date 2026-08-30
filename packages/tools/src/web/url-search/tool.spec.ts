import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlSearch, urlSearchTool, urlSearchInputSchema, urlSearchOutputSchema } from "./index.js";
describe("URL Search", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlSearchTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlSearchInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlSearchOutputSchema)).toBe(true);
    expect(runUrlSearch(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlSearch({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"search":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlSearch({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlSearch(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
