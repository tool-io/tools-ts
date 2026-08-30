import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl } from "../../core/url.js";

// Method reference: https://url.spec.whatwg.org/#idna
export type UnicodeToPunycodeInput = {
  readonly domain: string;
};
export type UnicodeToPunycodeOutput = {
  readonly domain: string;
};
export const unicodeToPunycodeInputSchema = {"type":"object","additionalProperties":false,"properties":{"domain":{"type":"string","maxLength":1000000,"description":"Unicode domain name without URL delimiters."}},"required":["domain"]} as const satisfies ToolJsonSchema;
export const unicodeToPunycodeOutputSchema = {"type":"object","additionalProperties":false,"properties":{"domain":{"type":"string","maxLength":1000000,"description":"Normalized ASCII domain name."}},"required":["domain"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUnicodeToPunycode = (input: unknown): ToolResult<UnicodeToPunycodeOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = unicodeToPunycodeInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, unicodeToPunycodeInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["domain"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UnicodeToPunycodeInput = {
    domain: values.domain as string
  };
  if(x.domain===""||/[\s/:?#@\[\]%]/.test(x.domain))return fail("domain","Provide only a domain name.","invalid_domain");
  let url;try{url=parseUrl("https://"+x.domain+"/");}catch(error){if(error instanceof TypeError)return fail("domain","Domain fails IDNA processing.","invalid_domain");throw error;}
  if(url.hostname==="" || /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname))return fail("domain","IP addresses are not domain labels.","invalid_domain");
  const output: UnicodeToPunycodeOutput = {domain:url.hostname};
  if (!matchesToolJsonSchema(output, unicodeToPunycodeOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const unicodeToPunycodeTool = defineTool<UnicodeToPunycodeInput, UnicodeToPunycodeOutput>({
  id: "web/unicode-to-punycode", title: "Unicode Domain to ASCII", description: "Normalize a Unicode domain using WHATWG URL IDNA processing and return its ASCII hostname without performing DNS lookup.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUnicodeToPunycode,
  inputSchema: unicodeToPunycodeInputSchema, outputSchema: unicodeToPunycodeOutputSchema,
  ports: {inputs: [{"id":"domain","label":"Unicode domain name without URL delimiters","description":"Unicode domain name without URL delimiters.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"domain","label":"Normalized ASCII domain name","description":"Normalized ASCII domain name.","valueType":{"type":"string"}}]},
});
export const runUnicodeToPunycode = unicodeToPunycodeTool.execute;
export const example = {"input":{"domain":"Bücher.example"},"output":{"domain":"xn--bcher-kva.example"}} satisfies ToolExample<UnicodeToPunycodeInput, UnicodeToPunycodeOutput>;
export default unicodeToPunycodeTool;
