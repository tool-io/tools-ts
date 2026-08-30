import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitHeaderValue, parseHeaderParameter} from "../content-type-parser/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc7239.html#section-4
export type ForwardedParserInput = {
  readonly header: string;
};
export type ForwardedParserOutput = {
  readonly elements: readonly (readonly { readonly name: string; readonly value: string }[])[];
};
export const forwardedParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Forwarded field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const forwardedParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"elements":{"type":"array","items":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000},"minItems":0,"maxItems":100000,"description":"Forwarded elements in field order."}},"required":["elements"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateForwardedParser = (input: unknown): ToolResult<ForwardedParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = forwardedParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, forwardedParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ForwardedParserInput = {
    header: values.header as string
  };
  const groups = splitHeaderValue(x.header,",");
  if (!groups) return fail("header", "Unbalanced Forwarded header.", "malformed_header");
  const elements: {name:string; value:string}[][] = [];
  for (const group of groups) {
    if (!group) return fail("header", "Forwarded elements cannot be empty.", "malformed_header");
    const parts = splitHeaderValue(group,";"); if (!parts) return fail("header", "Malformed Forwarded element.", "malformed_header");
    const element: {name:string; value:string}[] = [];
    const names = new Set<string>();
    for (const part of parts) {const p = parseHeaderParameter(part); if (!p || names.has(p.name)) return fail("header", "Forwarded parameter names must be valid and unique within an element.", "malformed_header"); names.add(p.name); element.push(p);}
    elements.push(element);
  }
  const output: ForwardedParserOutput = {elements};
  if (!matchesToolJsonSchema(output, forwardedParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const forwardedParserTool = defineTool<ForwardedParserInput, ForwardedParserOutput>({
  id: "http/forwarded-parser", title: "HTTP Forwarded Parser", description: "Parse RFC 7239 Forwarded elements into ordered parameter lists without inferring proxy trust or validating addresses.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateForwardedParser,
  inputSchema: forwardedParserInputSchema, outputSchema: forwardedParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Forwarded field value","description":"Forwarded field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"elements","label":"Forwarded elements in field order","description":"Forwarded elements in field order.","valueType":{"type":"list","items":{"type":"list","items":{"type":"object"}}}}]},
});
export const runForwardedParser = forwardedParserTool.execute;
export const example = {"input":{"header":"for=192.0.2.60;proto=https, for=\"[2001:db8::1]:4711\""},"output":{"elements":[[{"name":"for","value":"192.0.2.60"},{"name":"proto","value":"https"}],[{"name":"for","value":"[2001:db8::1]:4711"}]]}} satisfies ToolExample<ForwardedParserInput, ForwardedParserOutput>;
export default forwardedParserTool;
