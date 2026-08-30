import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlPathSegmentsInput = {
  readonly url: string;
};
export type UrlPathSegmentsOutput = {
  readonly segments: readonly string[];
};
export const urlPathSegmentsInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute hierarchical URL."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlPathSegmentsOutputSchema = {"type":"object","additionalProperties":false,"properties":{"segments":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000,"description":"Path segments without the initial slash."}},"required":["segments"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlPathSegments = (input: unknown): ToolResult<UrlPathSegmentsOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlPathSegmentsInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlPathSegmentsInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlPathSegmentsInput = {
    url: values.url as string
  };
  let parsed;
  try { parsed = parseUrl(x.url); }
  catch (error) { if (error instanceof TypeError) return fail("url", "Provide an absolute URL.", "malformed_url"); throw error; }
if (!parsed.pathname.startsWith("/")) return fail("url", "This URL has an opaque path.", "opaque_path");
  const output: UrlPathSegmentsOutput = {segments: parsed.pathname.slice(1).split("/")};
  if (!matchesToolJsonSchema(output, urlPathSegmentsOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlPathSegmentsTool = defineTool<UrlPathSegmentsInput, UrlPathSegmentsOutput>({
  id: "web/url-path-segments", title: "URL Path Segments", description: "Split a hierarchical absolute URL path into percent-encoded segments while preserving empty interior and trailing segments.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlPathSegments,
  inputSchema: urlPathSegmentsInputSchema, outputSchema: urlPathSegmentsOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute hierarchical URL","description":"Absolute hierarchical URL.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"segments","label":"Path segments without the initial slash","description":"Path segments without the initial slash.","valueType":{"type":"list","items":{"type":"string"}}}]},
});
export const runUrlPathSegments = urlPathSegmentsTool.execute;
export const example = {"input":{"url":"https://example.com/a//b%20c/"},"output":{"segments":["a","","b%20c",""]}} satisfies ToolExample<UrlPathSegmentsInput, UrlPathSegmentsOutput>;
export default urlPathSegmentsTool;
