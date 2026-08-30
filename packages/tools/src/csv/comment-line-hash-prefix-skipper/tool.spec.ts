import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, commentLineHashPrefixSkipperInputSchema, commentLineHashPrefixSkipperOutputSchema } from "./index.js";
describe("csv/comment-line-hash-prefix-skipper", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, commentLineHashPrefixSkipperInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, commentLineHashPrefixSkipperOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "\"#literal\",x\n# \"ignored quote\ny,z",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "csv": "\"#literal\",x\ny,z",
      "removedLineCount": 1
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "csv": "",
      "removedLineCount": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "a\"b\n#comment",
      "delimiter": ","
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_csv" }] } });
  });

});
