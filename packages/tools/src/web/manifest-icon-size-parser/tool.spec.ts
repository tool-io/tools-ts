import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runManifestIconSizeParser, manifestIconSizeParserTool, manifestIconSizeParserInputSchema, manifestIconSizeParserOutputSchema } from "./index.js";
describe("Manifest Icon Size Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(manifestIconSizeParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, manifestIconSizeParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, manifestIconSizeParserOutputSchema)).toBe(true);
    expect(runManifestIconSizeParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runManifestIconSizeParser({"sizes":""})).toEqual({ok: true, output: {"sizes":[],"any":false}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runManifestIconSizeParser({"sizes":"0x16"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "sizes", code: "invalid_size"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runManifestIconSizeParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
