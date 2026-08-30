import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitHeaderValue, parseHeaderParameter} from "../content-type-parser/tool.js";
// Method reference: https://httpwg.org/specs/rfc9110.html#field.accept
export type AcceptParserInput = {
  readonly header: string;
};
export type AcceptParserOutput = {
  readonly ranges: readonly {readonly range:string; readonly quality:number; readonly parameters:readonly { readonly name: string; readonly value: string }[]}[];
};
export const acceptParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Accept field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const acceptParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"ranges":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"range":{"type":"string","maxLength":1000000},"quality":{"type":"number","minimum":0,"maximum":1},"parameters":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000}},"required":["range","quality","parameters"]},"minItems":0,"maxItems":100000,"description":"Media ranges with explicit quality values."}},"required":["ranges"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateAcceptParser = (input: unknown): ToolResult<AcceptParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = acceptParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, acceptParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: AcceptParserInput = {
    header: values.header as string
  };
  const groups = splitHeaderValue(x.header,","); if (!groups) return fail("header", "Malformed Accept header.", "malformed_header");
  const ranges: {range:string;quality:number;parameters:{name:string;value:string}[]}[] = [];
  for (const group of groups) {
    if (!group) continue;
    const parts = splitHeaderValue(group,";"); if (!parts || !/^(?:\*\/\*|[!#$%&'*+.^_`|~0-9A-Za-z-]+\/(?:\*|[!#$%&'*+.^_`|~0-9A-Za-z-]+))$/.test(parts[0])) return fail("header", "Invalid media range.", "malformed_header");
    if (parts[0].startsWith("*/") && parts[0] !== "*/*") return fail("header", "A wildcard type requires a wildcard subtype.", "malformed_header");
    let quality = 1, seenQ = false; const parameters: {name:string;value:string}[] = [];
    for (const part of parts.slice(1)) {
      const p = parseHeaderParameter(part); if (!p) return fail("header", "Malformed Accept parameter.", "malformed_header");
      if (p.name === "q") {if (part.slice(part.indexOf("=")+1).trim().startsWith('"') || seenQ || !/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(p.value)) return fail("header", "Quality must be from zero to one with at most three decimal digits.", "invalid_quality"); seenQ = true; quality = Number(p.value);}
      else parameters.push(p);
    }
    ranges.push({range:parts[0].toLowerCase(),quality,parameters});
  }
  const output: AcceptParserOutput = {ranges};
  if (!matchesToolJsonSchema(output, acceptParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const acceptParserTool = defineTool<AcceptParserInput, AcceptParserOutput>({
  id: "http/accept-parser", title: "HTTP Accept Parser", description: "Parse media ranges, parameters, and q weights in Accept without collapsing order or choosing a representation.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateAcceptParser,
  inputSchema: acceptParserInputSchema, outputSchema: acceptParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Accept field value","description":"Accept field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"ranges","label":"Media ranges with explicit quality values","description":"Media ranges with explicit quality values.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runAcceptParser = acceptParserTool.execute;
export const example = {"input":{"header":"text/html, application/json;q=0.8, */*;q=0.1"},"output":{"ranges":[{"range":"text/html","quality":1,"parameters":[]},{"range":"application/json","quality":0.8,"parameters":[]},{"range":"*/*","quality":0.1,"parameters":[]}]}} satisfies ToolExample<AcceptParserInput, AcceptParserOutput>;
export default acceptParserTool;
