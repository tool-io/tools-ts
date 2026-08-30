import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runCacheBustAdder, cacheBustAdderTool, cacheBustAdderInputSchema, cacheBustAdderOutputSchema } from "./index.js";
describe("Cache Bust Query Adder", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(cacheBustAdderTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, cacheBustAdderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cacheBustAdderOutputSchema)).toBe(true);
    expect(runCacheBustAdder(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runCacheBustAdder({"url":"https://example.com/?v=old&v=older","name":"v","value":"new"})).toEqual({ok: true, output: {"url":"https://example.com/?v=new"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runCacheBustAdder({"url":"https://example.com/","name":"","value":"1"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "name", code: "empty_name"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runCacheBustAdder(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
