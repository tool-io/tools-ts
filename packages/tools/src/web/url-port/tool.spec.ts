import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlPort, urlPortTool, urlPortInputSchema, urlPortOutputSchema } from "./index.js";
describe("URL Port", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlPortTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlPortInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlPortOutputSchema)).toBe(true);
    expect(runUrlPort(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlPort({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"port":""}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlPort({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlPort(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
