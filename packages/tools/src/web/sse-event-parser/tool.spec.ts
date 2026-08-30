import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSseEventParser, sseEventParserTool, sseEventParserInputSchema, sseEventParserOutputSchema } from "./index.js";
describe("Server-Sent Event Parser", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(sseEventParserTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, sseEventParserInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sseEventParserOutputSchema)).toBe(true);
    expect(runSseEventParser(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSseEventParser({"stream":"data: unfinished\n"})).toEqual({ok: true, output: {"events":[],"lastEventId":"","retryMs":null}}));
  it("matches independent case 2", () => expect(runSseEventParser({"stream":"id: 2\ndata: a\n\ndata: b\n\n"})).toEqual({ok: true, output: {"events":[{"event":"message","data":"a","id":"2"},{"event":"message","data":"b","id":"2"}],"lastEventId":"2","retryMs":null}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runSseEventParser(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
