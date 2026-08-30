import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runPermissionsPolicyParser, permissionsPolicyParserTool, permissionsPolicyParserInputSchema, permissionsPolicyParserOutputSchema } from "./index.js";
describe("Permissions Policy Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(permissionsPolicyParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, permissionsPolicyParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, permissionsPolicyParserOutputSchema)).toBe(true);
    expect(runPermissionsPolicyParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runPermissionsPolicyParser({"header":""})).toEqual({ok: true, output: {"features":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runPermissionsPolicyParser({"header":"camera=(self), camera=*"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "header", code: "duplicate_feature"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runPermissionsPolicyParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
