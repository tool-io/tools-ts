import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlHashInput = {
  readonly url: string;
};
export type UrlHashOutput = {
  readonly hash: string;
};
export const urlHashInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute URL to parse."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlHashOutputSchema = {"type":"object","additionalProperties":false,"properties":{"hash":{"type":"string","maxLength":1000000,"description":"Normalized URL hash."}},"required":["hash"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlHash = (input: unknown): ToolResult<UrlHashOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlHashInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlHashInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlHashInput = {
    url: values.url as string
  };
  let parsed;
  try { parsed = parseUrl(x.url); }
  catch (error) { if (error instanceof TypeError) return fail("url", "Provide an absolute URL.", "malformed_url"); throw error; }
const output: UrlHashOutput = { hash: parsed.hash };
  if (!matchesToolJsonSchema(output, urlHashOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlHashTool = defineTool<UrlHashInput, UrlHashOutput>({
  id: "web/url-hash", title: "URL Hash", description: "Extract the hash of an absolute URL using the WHATWG URL parser, including its normalization rules.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlHash,
  inputSchema: urlHashInputSchema, outputSchema: urlHashOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute URL to parse","description":"Absolute URL to parse.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"hash","label":"Normalized URL hash","description":"Normalized URL hash.","valueType":{"type":"string"}}]},
});
export const runUrlHash = urlHashTool.execute;
export const example = {"input":{"url":"https://reader:secret@EXAMPLE.com:8443/a/../guide?q=one&q=two#part"},"output":{"hash":"#part"}} satisfies ToolExample<UrlHashInput, UrlHashOutput>;
export default urlHashTool;
