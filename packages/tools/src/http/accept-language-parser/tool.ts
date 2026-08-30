import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://httpwg.org/specs/rfc9110.html#field.accept-language
export type AcceptLanguageParserInput = {
  readonly header: string;
};
export type AcceptLanguageParserOutput = {
  readonly languages: readonly {readonly range:string;readonly quality:number}[];
};
export const acceptLanguageParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Accept-Language field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const acceptLanguageParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"languages":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"range":{"type":"string","maxLength":1000000},"quality":{"type":"number","minimum":0,"maximum":1}},"required":["range","quality"]},"minItems":0,"maxItems":100000,"description":"Language ranges and their quality weights."}},"required":["languages"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateAcceptLanguageParser = (input: unknown): ToolResult<AcceptLanguageParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = acceptLanguageParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, acceptLanguageParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: AcceptLanguageParserInput = {
    header: values.header as string
  };
  if (/[\x00-\x08\x0a-\x1f\x7f]/.test(x.header)) return fail("header", "Invalid header control character.", "malformed_header");
  const languages: {range:string;quality:number}[] = [];
  for (const part of x.header.split(",")) {
    if (!part.trim()) continue;
    const m = /^\s*(\*|[A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*)\s*(?:;\s*q\s*=\s*(0(?:\.\d{0,3})?|1(?:\.0{0,3})?))?\s*$/i.exec(part);
    if (!m) return fail("header", "Invalid language range or quality weight.", "malformed_header");
    languages.push({range:m[1].toLowerCase(),quality:m[2] === undefined ? 1 : Number(m[2])});
  }
  const output: AcceptLanguageParserOutput = {languages};
  if (!matchesToolJsonSchema(output, acceptLanguageParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const acceptLanguageParserTool = defineTool<AcceptLanguageParserInput, AcceptLanguageParserOutput>({
  id: "http/accept-language-parser", title: "HTTP Accept-Language Parser", description: "Parse RFC 4647 basic language ranges and HTTP quality weights while retaining header order.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateAcceptLanguageParser,
  inputSchema: acceptLanguageParserInputSchema, outputSchema: acceptLanguageParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Accept-Language field value","description":"Accept-Language field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"languages","label":"Language ranges and their quality weights","description":"Language ranges and their quality weights.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runAcceptLanguageParser = acceptLanguageParserTool.execute;
export const example = {"input":{"header":"en-US, de;q=0.8, *;q=0"},"output":{"languages":[{"range":"en-us","quality":1},{"range":"de","quality":0.8},{"range":"*","quality":0}]}} satisfies ToolExample<AcceptLanguageParserInput, AcceptLanguageParserOutput>;
export default acceptLanguageParserTool;
