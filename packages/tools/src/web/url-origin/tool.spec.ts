import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlOrigin, urlOriginTool, urlOriginInputSchema, urlOriginOutputSchema } from "./index.js";
describe("URL Origin", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlOriginTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlOriginInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlOriginOutputSchema)).toBe(true);
    expect(runUrlOrigin(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlOrigin({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"origin":"null"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlOrigin({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlOrigin(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
