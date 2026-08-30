import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlPortInput = {
  readonly url: string;
};
export type UrlPortOutput = {
  readonly port: string;
};
export const urlPortInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute URL to parse."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlPortOutputSchema = {"type":"object","additionalProperties":false,"properties":{"port":{"type":"string","maxLength":1000000,"description":"Normalized URL port."}},"required":["port"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlPort = (input: unknown): ToolResult<UrlPortOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlPortInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlPortInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlPortInput = {
    url: values.url as string
  };
  let parsed;
  try { parsed = parseUrl(x.url); }
  catch (error) { if (error instanceof TypeError) return fail("url", "Provide an absolute URL.", "malformed_url"); throw error; }
const output: UrlPortOutput = { port: parsed.port };
  if (!matchesToolJsonSchema(output, urlPortOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlPortTool = defineTool<UrlPortInput, UrlPortOutput>({
  id: "web/url-port", title: "URL Port", description: "Extract the port of an absolute URL using the WHATWG URL parser, including its normalization rules.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlPort,
  inputSchema: urlPortInputSchema, outputSchema: urlPortOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute URL to parse","description":"Absolute URL to parse.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"port","label":"Normalized URL port","description":"Normalized URL port.","valueType":{"type":"string"}}]},
});
export const runUrlPort = urlPortTool.execute;
export const example = {"input":{"url":"https://reader:secret@EXAMPLE.com:8443/a/../guide?q=one&q=two#part"},"output":{"port":"8443"}} satisfies ToolExample<UrlPortInput, UrlPortOutput>;
export default urlPortTool;
