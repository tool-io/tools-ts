import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlIsAbsoluteInput = {
  readonly url: string;
};
export type UrlIsAbsoluteOutput = {
  readonly result: boolean;
};
export const urlIsAbsoluteInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"URL reference to classify."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlIsAbsoluteOutputSchema = {"type":"object","additionalProperties":false,"properties":{"result":{"type":"boolean","description":"Whether the reference matches this URL class."}},"required":["result"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlIsAbsolute = (input: unknown): ToolResult<UrlIsAbsoluteOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlIsAbsoluteInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlIsAbsoluteInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlIsAbsoluteInput = {
    url: values.url as string
  };
  let absolute = false;
  try { parseUrl(x.url); absolute = true; } catch (error) { if (!(error instanceof TypeError)) throw error; }
  const output: UrlIsAbsoluteOutput = {result: absolute};
  if (!matchesToolJsonSchema(output, urlIsAbsoluteOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlIsAbsoluteTool = defineTool<UrlIsAbsoluteInput, UrlIsAbsoluteOutput>({
  id: "web/url-is-absolute", title: "URL Is Absolute", description: "Check whether a reference parses as an absolute WHATWG URL.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlIsAbsolute,
  inputSchema: urlIsAbsoluteInputSchema, outputSchema: urlIsAbsoluteOutputSchema,
  ports: {inputs: [{"id":"url","label":"URL reference to classify","description":"URL reference to classify.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"result","label":"Whether the reference matches this URL class","description":"Whether the reference matches this URL class.","valueType":{"type":"boolean"}}]},
});
export const runUrlIsAbsolute = urlIsAbsoluteTool.execute;
export const example = {"input":{"url":"../assets/icon.svg"},"output":{"result":false}} satisfies ToolExample<UrlIsAbsoluteInput, UrlIsAbsoluteOutput>;
export default urlIsAbsoluteTool;
