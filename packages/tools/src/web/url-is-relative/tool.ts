import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type UrlIsRelativeInput = {
  readonly url: string;
};
export type UrlIsRelativeOutput = {
  readonly result: boolean;
};
export const urlIsRelativeInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"URL reference to classify."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlIsRelativeOutputSchema = {"type":"object","additionalProperties":false,"properties":{"result":{"type":"boolean","description":"Whether the reference matches this URL class."}},"required":["result"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlIsRelative = (input: unknown): ToolResult<UrlIsRelativeOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlIsRelativeInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlIsRelativeInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlIsRelativeInput = {
    url: values.url as string
  };
  let absolute = false;
  try { parseUrl(x.url); absolute = true; } catch (error) { if (!(error instanceof TypeError)) throw error; }
  let resolvable = false;
  try { parseUrl(x.url, "https://example.invalid/"); resolvable = true; } catch (error) { if (!(error instanceof TypeError)) throw error; }
  const output: UrlIsRelativeOutput = {result: !absolute && resolvable};
  if (!matchesToolJsonSchema(output, urlIsRelativeOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlIsRelativeTool = defineTool<UrlIsRelativeInput, UrlIsRelativeOutput>({
  id: "web/url-is-relative", title: "URL Is Relative", description: "Check whether a reference needs a base URL and resolves against a hierarchical HTTPS base.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlIsRelative,
  inputSchema: urlIsRelativeInputSchema, outputSchema: urlIsRelativeOutputSchema,
  ports: {inputs: [{"id":"url","label":"URL reference to classify","description":"URL reference to classify.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"result","label":"Whether the reference matches this URL class","description":"Whether the reference matches this URL class.","valueType":{"type":"boolean"}}]},
});
export const runUrlIsRelative = urlIsRelativeTool.execute;
export const example = {"input":{"url":"../assets/icon.svg"},"output":{"result":true}} satisfies ToolExample<UrlIsRelativeInput, UrlIsRelativeOutput>;
export default urlIsRelativeTool;
