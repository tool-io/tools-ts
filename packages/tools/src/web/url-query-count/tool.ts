import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlQueryCountInput = {
  readonly url: string;
};
export type UrlQueryCountOutput = {
  readonly count: number;
};
export const urlQueryCountInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute URL."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlQueryCountOutputSchema = {"type":"object","additionalProperties":false,"properties":{"count":{"type":"integer","minimum":0,"description":"Number of query parameters."}},"required":["count"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlQueryCount = (input: unknown): ToolResult<UrlQueryCountOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlQueryCountInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlQueryCountInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlQueryCountInput = {
    url: values.url as string
  };
  let parsed;
  try { parsed = parseUrl(x.url); }
  catch (error) { if (error instanceof TypeError) return fail("url", "Provide an absolute URL.", "malformed_url"); throw error; }
const output: UrlQueryCountOutput = {count: parsed.searchParams.size};
  if (!matchesToolJsonSchema(output, urlQueryCountOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlQueryCountTool = defineTool<UrlQueryCountInput, UrlQueryCountOutput>({
  id: "web/url-query-count", title: "URL Query Count", description: "Count parsed query parameters in an absolute URL, including repeated names and empty values.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlQueryCount,
  inputSchema: urlQueryCountInputSchema, outputSchema: urlQueryCountOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute URL","description":"Absolute URL.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"count","label":"Number of query parameters","description":"Number of query parameters.","valueType":{"type":"integer"}}]},
});
export const runUrlQueryCount = urlQueryCountTool.execute;
export const example = {"input":{"url":"https://example.com/?tag=a&tag=b&empty="},"output":{"count":3}} satisfies ToolExample<UrlQueryCountInput, UrlQueryCountOutput>;
export default urlQueryCountTool;
