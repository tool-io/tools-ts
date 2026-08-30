import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runWebsocketUrlValidator, websocketUrlValidatorTool, websocketUrlValidatorInputSchema, websocketUrlValidatorOutputSchema } from "./index.js";
describe("WebSocket URL Validator", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(websocketUrlValidatorTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, websocketUrlValidatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, websocketUrlValidatorOutputSchema)).toBe(true);
    expect(runWebsocketUrlValidator(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runWebsocketUrlValidator({"url":"wss://user:pass@example.com/"})).toEqual({ok: true, output: {"valid":true}}));
  it("matches independent case 2", () => expect(runWebsocketUrlValidator({"url":"ws://example.com/#"})).toEqual({ok: true, output: {"valid":false}}));
  it("matches independent case 3", () => expect(runWebsocketUrlValidator({"url":"https://example.com/"})).toEqual({ok: true, output: {"valid":true}}));
  it("rejects a non-object input with a stable issue", () => {
    const result = runWebsocketUrlValidator(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
