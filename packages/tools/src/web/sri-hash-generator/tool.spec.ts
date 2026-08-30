import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSriHashGenerator, sriHashGeneratorTool, sriHashGeneratorInputSchema, sriHashGeneratorOutputSchema } from "./index.js";
describe("Subresource Integrity Hash Generator", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(sriHashGeneratorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, sriHashGeneratorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sriHashGeneratorOutputSchema)).toBe(true);
    expect(runSriHashGenerator(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSriHashGenerator({"text":"","algorithm":"sha256"})).toEqual({ok: true, output: {"integrity":"sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU="}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSriHashGenerator({"text":"abc","algorithm":"md5"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "algorithm", code: "invalid_field"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSriHashGenerator(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
