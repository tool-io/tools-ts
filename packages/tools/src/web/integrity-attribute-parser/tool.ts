import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://w3c.github.io/webappsec-subresource-integrity/#parse-metadata
export type IntegrityAttributeParserInput = {
  readonly integrity: string;
};
export type IntegrityAttributeParserOutput = {
  readonly metadata: readonly {readonly algorithm:string;readonly digest:string;readonly options:string}[];
  readonly ignored: readonly string[];
};
export const integrityAttributeParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"integrity":{"type":"string","maxLength":1000000,"description":"HTML integrity attribute value."}},"required":["integrity"]} as const satisfies ToolJsonSchema;
export const integrityAttributeParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"metadata":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"algorithm":{"type":"string","maxLength":1000000},"digest":{"type":"string","maxLength":1000000},"options":{"type":"string","maxLength":1000000}},"required":["algorithm","digest","options"]},"minItems":0,"maxItems":100000,"description":"Supported integrity metadata."},"ignored":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000,"description":"Unsupported or malformed integrity tokens."}},"required":["metadata","ignored"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateIntegrityAttributeParser = (input: unknown): ToolResult<IntegrityAttributeParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = integrityAttributeParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, integrityAttributeParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["integrity"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: IntegrityAttributeParserInput = {
    integrity: values.integrity as string
  };
  const metadata:{algorithm:string;digest:string;options:string}[]=[], ignored:string[]=[];
  for(const token of x.integrity.trim().split(/[\t\n\f\r ]+/)) {
    if(!token)continue;const match=/^(sha256|sha384|sha512)-([A-Za-z0-9+/_-]+={0,2})(?:\?([\x21-\x7e]*))?$/.exec(token);
    if(match)metadata.push({algorithm:match[1],digest:match[2],options:match[3]??""});else ignored.push(token);
  }
  const output: IntegrityAttributeParserOutput = {metadata,ignored};
  if (!matchesToolJsonSchema(output, integrityAttributeParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const integrityAttributeParserTool = defineTool<IntegrityAttributeParserInput, IntegrityAttributeParserOutput>({
  id: "web/integrity-attribute-parser", title: "Integrity Attribute Parser", description: "Split integrity metadata into supported SHA algorithm tokens, digest text, and options, reporting unsupported or malformed tokens separately.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateIntegrityAttributeParser,
  inputSchema: integrityAttributeParserInputSchema, outputSchema: integrityAttributeParserOutputSchema,
  ports: {inputs: [{"id":"integrity","label":"HTML integrity attribute value","description":"HTML integrity attribute value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"metadata","label":"Supported integrity metadata","description":"Supported integrity metadata.","valueType":{"type":"list","items":{"type":"object"}}},{"id":"ignored","label":"Unsupported or malformed integrity tokens","description":"Unsupported or malformed integrity tokens.","valueType":{"type":"list","items":{"type":"string"}}}]},
});
export const runIntegrityAttributeParser = integrityAttributeParserTool.execute;
export const example = {"input":{"integrity":"sha256-YWJj sha384-ZGVm?foo=bar md5-aaa"},"output":{"metadata":[{"algorithm":"sha256","digest":"YWJj","options":""},{"algorithm":"sha384","digest":"ZGVm","options":"foo=bar"}],"ignored":["md5-aaa"]}} satisfies ToolExample<IntegrityAttributeParserInput, IntegrityAttributeParserOutput>;
export default integrityAttributeParserTool;
