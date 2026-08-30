import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlHost, urlHostTool, urlHostInputSchema, urlHostOutputSchema } from "./index.js";
describe("URL Host", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlHostTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlHostInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlHostOutputSchema)).toBe(true);
    expect(runUrlHost(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlHost({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"host":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlHost({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlHost(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
