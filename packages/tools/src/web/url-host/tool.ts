import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlHostInput = {
  readonly url: string;
};
export type UrlHostOutput = {
  readonly host: string;
};
export const urlHostInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute URL to parse."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlHostOutputSchema = {"type":"object","additionalProperties":false,"properties":{"host":{"type":"string","maxLength":1000000,"description":"Normalized URL host."}},"required":["host"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlHost = (input: unknown): ToolResult<UrlHostOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlHostInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlHostInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlHostInput = {
    url: values.url as string
  };
  let parsed;
  try { parsed = parseUrl(x.url); }
  catch (error) { if (error instanceof TypeError) return fail("url", "Provide an absolute URL.", "malformed_url"); throw error; }
const output: UrlHostOutput = { host: parsed.host };
  if (!matchesToolJsonSchema(output, urlHostOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlHostTool = defineTool<UrlHostInput, UrlHostOutput>({
  id: "web/url-host", title: "URL Host", description: "Extract the host of an absolute URL using the WHATWG URL parser, including its normalization rules.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlHost,
  inputSchema: urlHostInputSchema, outputSchema: urlHostOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute URL to parse","description":"Absolute URL to parse.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"host","label":"Normalized URL host","description":"Normalized URL host.","valueType":{"type":"string"}}]},
});
export const runUrlHost = urlHostTool.execute;
export const example = {"input":{"url":"https://reader:secret@EXAMPLE.com:8443/a/../guide?q=one&q=two#part"},"output":{"host":"example.com:8443"}} satisfies ToolExample<UrlHostInput, UrlHostOutput>;
export default urlHostTool;
