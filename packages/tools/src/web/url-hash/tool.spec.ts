import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlHash, urlHashTool, urlHashInputSchema, urlHashOutputSchema } from "./index.js";
describe("URL Hash", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlHashTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlHashInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlHashOutputSchema)).toBe(true);
    expect(runUrlHash(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlHash({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"hash":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlHash({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlHash(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
