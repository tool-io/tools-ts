import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runUrlDataParser, urlDataParserTool, urlDataParserInputSchema, urlDataParserOutputSchema } from "./index.js";
describe("Data URL Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(urlDataParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, urlDataParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, urlDataParserOutputSchema)).toBe(true);
    expect(runUrlDataParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runUrlDataParser({"url":"data:,A%20B%FF"})).toEqual({ok: true, output: {"mediaType":"text/plain;charset=US-ASCII","base64":false,"bytes":[65,32,66,255]}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runUrlDataParser({"url":"data:text/plain"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "url", code: "malformed_data_url"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runUrlDataParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
