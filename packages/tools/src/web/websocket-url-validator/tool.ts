import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://websockets.spec.whatwg.org/#dom-websocket-websocket
export type WebsocketUrlValidatorInput = {
  readonly url: string;
};
export type WebsocketUrlValidatorOutput = {
  readonly valid: boolean;
};
export const websocketUrlValidatorInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"WebSocket URL."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const websocketUrlValidatorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"valid":{"type":"boolean","description":"Whether the URL satisfies WebSocket URL restrictions."}},"required":["valid"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateWebsocketUrlValidator = (input: unknown): ToolResult<WebsocketUrlValidatorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = websocketUrlValidatorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, websocketUrlValidatorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: WebsocketUrlValidatorInput = {
    url: values.url as string
  };
  let valid = false;
  try { const url = parseUrl(x.url); valid = ["ws:", "wss:", "http:", "https:"].includes(url.protocol) && url.hostname !== "" && !url.href.includes("#"); }
  catch (error) { if (!(error instanceof TypeError)) throw error; }
  const output: WebsocketUrlValidatorOutput = {valid};
  if (!matchesToolJsonSchema(output, websocketUrlValidatorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const websocketUrlValidatorTool = defineTool<WebsocketUrlValidatorInput, WebsocketUrlValidatorOutput>({
  id: "web/websocket-url-validator", title: "WebSocket URL Validator", description: "Check an absolute ws, wss, http, or https URL against WebSocket constructor URL rules, excluding fragments. HTTP schemes are accepted by the constructor and mapped to WebSocket schemes.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateWebsocketUrlValidator,
  inputSchema: websocketUrlValidatorInputSchema, outputSchema: websocketUrlValidatorOutputSchema,
  ports: {inputs: [{"id":"url","label":"WebSocket URL","description":"WebSocket URL.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"valid","label":"Whether the URL satisfies WebSocket URL restrictions","description":"Whether the URL satisfies WebSocket URL restrictions.","valueType":{"type":"boolean"}}]},
});
export const runWebsocketUrlValidator = websocketUrlValidatorTool.execute;
export const example = {"input":{"url":"wss://example.com/chat"},"output":{"valid":true}} satisfies ToolExample<WebsocketUrlValidatorInput, WebsocketUrlValidatorOutput>;
export default websocketUrlValidatorTool;
