import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlProtocol, urlProtocolTool, urlProtocolInputSchema, urlProtocolOutputSchema } from "./index.js";
describe("URL Protocol", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlProtocolTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlProtocolInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlProtocolOutputSchema)).toBe(true);
    expect(runUrlProtocol(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlProtocol({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"protocol":"mailto:"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlProtocol({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlProtocol(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
