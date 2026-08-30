import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlIsBlobInput = {
  readonly url: string;
};
export type UrlIsBlobOutput = {
  readonly result: boolean;
};
export const urlIsBlobInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"URL to classify."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlIsBlobOutputSchema = {"type":"object","additionalProperties":false,"properties":{"result":{"type":"boolean","description":"Whether the URL uses the requested scheme."}},"required":["result"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlIsBlob = (input: unknown): ToolResult<UrlIsBlobOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlIsBlobInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlIsBlobInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlIsBlobInput = {
    url: values.url as string
  };
  let result = false;
  try { result = parseUrl(x.url).protocol === "blob:"; } catch (error) { if (!(error instanceof TypeError)) throw error; }
  const output: UrlIsBlobOutput = {result};
  if (!matchesToolJsonSchema(output, urlIsBlobOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlIsBlobTool = defineTool<UrlIsBlobInput, UrlIsBlobOutput>({
  id: "web/url-is-blob", title: "URL Is Blob", description: "Check whether an absolute WHATWG URL uses the blob scheme.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlIsBlob,
  inputSchema: urlIsBlobInputSchema, outputSchema: urlIsBlobOutputSchema,
  ports: {inputs: [{"id":"url","label":"URL to classify","description":"URL to classify.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"result","label":"Whether the URL uses the requested scheme","description":"Whether the URL uses the requested scheme.","valueType":{"type":"boolean"}}]},
});
export const runUrlIsBlob = urlIsBlobTool.execute;
export const example = {"input":{"url":"blob:https://example.com/123"},"output":{"result":true}} satisfies ToolExample<UrlIsBlobInput, UrlIsBlobOutput>;
export default urlIsBlobTool;
