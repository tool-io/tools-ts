import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runModulepreloadDetector, modulepreloadDetectorTool, modulepreloadDetectorInputSchema, modulepreloadDetectorOutputSchema } from "./index.js";
describe("ModulepreloadDetector", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(modulepreloadDetectorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, modulepreloadDetectorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, modulepreloadDetectorOutputSchema)).toBe(true);
    expect(runModulepreloadDetector(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runModulepreloadDetector({"html":"<script>\"<link rel=modulepreload href=/fake>\"</script>"})).toEqual({ok: true, output: {"hrefs":[]}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runModulepreloadDetector(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
