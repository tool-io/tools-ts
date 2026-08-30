import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlQueryCount, urlQueryCountTool, urlQueryCountInputSchema, urlQueryCountOutputSchema } from "./index.js";
describe("URL Query Count", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlQueryCountTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlQueryCountInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlQueryCountOutputSchema)).toBe(true);
    expect(runUrlQueryCount(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlQueryCount({"url":"https://example.com/?&&"})).toEqual({ok: true, output: {"count":0}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlQueryCount({"url":"https://["});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlQueryCount(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
