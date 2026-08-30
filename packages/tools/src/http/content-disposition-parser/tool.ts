import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitHeaderValue, parseHeaderParameter} from "../content-type-parser/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc6266.html
export type ContentDispositionParserInput = {
  readonly header: string;
};
export type ContentDispositionParserOutput = {
  readonly disposition: string;
  readonly parameters: readonly { readonly name: string; readonly value: string }[];
};
export const contentDispositionParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Content-Disposition field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const contentDispositionParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"disposition":{"type":"string","maxLength":1000000,"description":"Lowercase disposition type."},"parameters":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Parameters in source order with unquoted values."}},"required":["disposition","parameters"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateContentDispositionParser = (input: unknown): ToolResult<ContentDispositionParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = contentDispositionParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, contentDispositionParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ContentDispositionParserInput = {
    header: values.header as string
  };
  const parts = splitHeaderValue(x.header,";");
  if (!parts || !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(parts[0])) return fail("header", "Invalid disposition type.", "malformed_header");
  const parameters: {name: string; value: string}[] = [];
  const names = new Set<string>();
  for (const part of parts.slice(1)) {
    const value = parseHeaderParameter(part);
    if (!value || names.has(value.name)) return fail("header", "Invalid or repeated disposition parameter.", "malformed_header");
    names.add(value.name); parameters.push(value);
  }
  const output: ContentDispositionParserOutput = {disposition: parts[0].toLowerCase(), parameters};
  if (!matchesToolJsonSchema(output, contentDispositionParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const contentDispositionParserTool = defineTool<ContentDispositionParserInput, ContentDispositionParserOutput>({
  id: "http/content-disposition-parser", title: "HTTP Content-Disposition Parser", description: "Parse a disposition type and unquote its parameters, preserving RFC 5987 extended values for caller interpretation.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateContentDispositionParser,
  inputSchema: contentDispositionParserInputSchema, outputSchema: contentDispositionParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Content-Disposition field value","description":"Content-Disposition field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"disposition","label":"Lowercase disposition type","description":"Lowercase disposition type.","valueType":{"type":"string"}},{"id":"parameters","label":"Parameters in source order with unquoted values","description":"Parameters in source order with unquoted values.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runContentDispositionParser = contentDispositionParserTool.execute;
export const example = {"input":{"header":"attachment; filename=\"report;final.csv\""},"output":{"disposition":"attachment","parameters":[{"name":"filename","value":"report;final.csv"}]}} satisfies ToolExample<ContentDispositionParserInput, ContentDispositionParserOutput>;
export default contentDispositionParserTool;
