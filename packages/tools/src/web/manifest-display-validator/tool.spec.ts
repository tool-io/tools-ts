import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runManifestDisplayValidator, manifestDisplayValidatorTool, manifestDisplayValidatorInputSchema, manifestDisplayValidatorOutputSchema } from "./index.js";
describe("Manifest Display Validator", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(manifestDisplayValidatorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, manifestDisplayValidatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, manifestDisplayValidatorOutputSchema)).toBe(true);
    expect(runManifestDisplayValidator(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runManifestDisplayValidator({"display":"window-controls-overlay"})).toEqual({ok: true, output: {"valid":false}}));
  it("matches independent case 2", () => expect(runManifestDisplayValidator({"display":"Standalone"})).toEqual({ok: true, output: {"valid":false}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runManifestDisplayValidator(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
