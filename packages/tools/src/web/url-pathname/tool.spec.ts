import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlPathname, urlPathnameTool, urlPathnameInputSchema, urlPathnameOutputSchema } from "./index.js";
describe("URL Pathname", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlPathnameTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlPathnameInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlPathnameOutputSchema)).toBe(true);
    expect(runUrlPathname(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlPathname({"url":"mailto:person@example.com"})).toEqual({ok: true, output: {"pathname":"person@example.com"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlPathname({"url":"/relative"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlPathname(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
