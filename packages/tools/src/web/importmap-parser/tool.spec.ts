import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runImportmapParser, importmapParserTool, importmapParserInputSchema, importmapParserOutputSchema } from "./index.js";
describe("Import Map Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(importmapParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, importmapParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, importmapParserOutputSchema)).toBe(true);
    expect(runImportmapParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runImportmapParser({"json":"{}"})).toEqual({ok: true, output: {"imports":[],"scopes":[]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runImportmapParser({"json":"{\"imports\":{\"x\":42}}"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "json", code: "invalid_imports"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runImportmapParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
