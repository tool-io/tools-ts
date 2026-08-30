import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlHostnameInput = {
  readonly url: string;
};
export type UrlHostnameOutput = {
  readonly hostname: string;
};
export const urlHostnameInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute URL to parse."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlHostnameOutputSchema = {"type":"object","additionalProperties":false,"properties":{"hostname":{"type":"string","maxLength":1000000,"description":"Normalized URL hostname."}},"required":["hostname"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlHostname = (input: unknown): ToolResult<UrlHostnameOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlHostnameInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlHostnameInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlHostnameInput = {
    url: values.url as string
  };
  let parsed;
  try { parsed = parseUrl(x.url); }
  catch (error) { if (error instanceof TypeError) return fail("url", "Provide an absolute URL.", "malformed_url"); throw error; }
const output: UrlHostnameOutput = { hostname: parsed.hostname };
  if (!matchesToolJsonSchema(output, urlHostnameOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlHostnameTool = defineTool<UrlHostnameInput, UrlHostnameOutput>({
  id: "web/url-hostname", title: "URL Hostname", description: "Extract the hostname of an absolute URL using the WHATWG URL parser, including its normalization rules.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlHostname,
  inputSchema: urlHostnameInputSchema, outputSchema: urlHostnameOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute URL to parse","description":"Absolute URL to parse.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"hostname","label":"Normalized URL hostname","description":"Normalized URL hostname.","valueType":{"type":"string"}}]},
});
export const runUrlHostname = urlHostnameTool.execute;
export const example = {"input":{"url":"https://reader:secret@EXAMPLE.com:8443/a/../guide?q=one&q=two#part"},"output":{"hostname":"example.com"}} satisfies ToolExample<UrlHostnameInput, UrlHostnameOutput>;
export default urlHostnameTool;
