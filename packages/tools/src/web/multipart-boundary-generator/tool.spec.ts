import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runMultipartBoundaryGenerator, multipartBoundaryGeneratorTool, multipartBoundaryGeneratorInputSchema, multipartBoundaryGeneratorOutputSchema } from "./index.js";
describe("Multipart Boundary Generator", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(multipartBoundaryGeneratorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, multipartBoundaryGeneratorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, multipartBoundaryGeneratorOutputSchema)).toBe(true);
    expect(runMultipartBoundaryGenerator(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runMultipartBoundaryGenerator({"entropyBytes":[1,35,69,103,137,171,205,239],"body":"--toolio-0123456789abcdef\r\nnext"})).toEqual({ok: true, output: {"boundary":"toolio-0123456789abcdef","collides":true}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runMultipartBoundaryGenerator({"entropyBytes":[1],"body":""});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "entropyBytes", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runMultipartBoundaryGenerator(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
