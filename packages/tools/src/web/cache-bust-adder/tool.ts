import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#api
export type CacheBustAdderInput = {
  readonly url: string;
  readonly name: string;
  readonly value: string;
};
export type CacheBustAdderOutput = {
  readonly url: string;
};
export const cacheBustAdderInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute URL."},"name":{"type":"string","maxLength":1000000,"description":"Nonempty query parameter name."},"value":{"type":"string","maxLength":1000000,"description":"Explicit cache version or token."}},"required":["url","name","value"]} as const satisfies ToolJsonSchema;
export const cacheBustAdderOutputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"URL containing the cache-busting parameter."}},"required":["url"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCacheBustAdder = (input: unknown): ToolResult<CacheBustAdderOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = cacheBustAdderInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, cacheBustAdderInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url","name","value"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CacheBustAdderInput = {
    url: values.url as string,
    name: values.name as string,
    value: values.value as string
  };
  let parsed;
  try { parsed = parseUrl(x.url); }
  catch (error) { if (error instanceof TypeError) return fail("url", "Provide an absolute URL.", "malformed_url"); throw error; }
if (x.name.length === 0) return fail("name", "The parameter name must not be empty.", "empty_name");
  parsed.searchParams.set(x.name, x.value);
  const output: CacheBustAdderOutput = {url: parsed.href};
  if (!matchesToolJsonSchema(output, cacheBustAdderOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const cacheBustAdderTool = defineTool<CacheBustAdderInput, CacheBustAdderOutput>({
  id: "web/cache-bust-adder", title: "Cache Bust Query Adder", description: "Set one named cache-busting query parameter on an absolute URL while preserving other parameters and its fragment.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCacheBustAdder,
  inputSchema: cacheBustAdderInputSchema, outputSchema: cacheBustAdderOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute URL","description":"Absolute URL.","valueType":{"type":"string"},"required":true},{"id":"name","label":"Nonempty query parameter name","description":"Nonempty query parameter name.","valueType":{"type":"string"},"required":true},{"id":"value","label":"Explicit cache version or token","description":"Explicit cache version or token.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"url","label":"URL containing the cache-busting parameter","description":"URL containing the cache-busting parameter.","valueType":{"type":"string"}}]},
});
export const runCacheBustAdder = cacheBustAdderTool.execute;
export const example = {"input":{"url":"https://example.com/app.js?lang=en#top","name":"v","value":"2026-09"},"output":{"url":"https://example.com/app.js?lang=en&v=2026-09#top"}} satisfies ToolExample<CacheBustAdderInput, CacheBustAdderOutput>;
export default cacheBustAdderTool;
