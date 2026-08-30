import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://httpwg.org/specs/rfc9110.html#media.type
export type ContentTypeParserInput = {
  readonly header: string;
};
export type ContentTypeParserOutput = {
  readonly mediaType: string;
  readonly parameters: readonly { readonly name: string; readonly value: string }[];
};
export const contentTypeParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Content-Type field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const contentTypeParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"mediaType":{"type":"string","maxLength":1000000,"description":"Lowercase media type."},"parameters":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Parameters in source order with unquoted values."}},"required":["mediaType","parameters"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

const TOKEN = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
export const splitHeaderValue = (value: string, delimiter: string): string[] | null => {
  if (/[\x00-\x08\x0a-\x1f\x7f]/.test(value)) return null;
  const parts: string[] = [];
  let start = 0, quoted = false, escaped = false, angle = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (escaped) { escaped = false; continue; }
    if (quoted && char === "\\") { escaped = true; continue; }
    if (char === '"') quoted = !quoted;
    else if (!quoted && char === "<") angle = true;
    else if (!quoted && char === ">") angle = false;
    else if (!quoted && !angle && char === delimiter) { parts.push(value.slice(start, i).trim()); start = i + 1; }
  }
  if (quoted || escaped || angle) return null;
  parts.push(value.slice(start).trim());
  return parts;
};
export const parseHeaderParameter = (value: string): {readonly name: string; readonly value: string} | null => {
  const eq = value.indexOf("=");
  if (eq <= 0) return null;
  const name = value.slice(0, eq).trim().toLowerCase(), raw = value.slice(eq + 1).trim();
  if (!TOKEN.test(name)) return null;
  if (TOKEN.test(raw)) return {name, value: raw};
  if (!/^"(?:[\t\x20\x21\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\t\x20-\x7e\x80-\xff])*"$/.test(raw)) return null;
  return {name, value: raw.slice(1,-1).replace(/\\([\s\S])/g, "$1")};
};

export const calculateContentTypeParser = (input: unknown): ToolResult<ContentTypeParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = contentTypeParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, contentTypeParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ContentTypeParserInput = {
    header: values.header as string
  };
  const parts = splitHeaderValue(x.header, ";");
  if (!parts || parts.length === 0 || !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(parts[0])) return fail("header", "Provide a media type and valid parameters.", "malformed_header");
  const parameters: {name: string; value: string}[] = [];
  const names = new Set<string>();
  for (const part of parts.slice(1)) {
    const parameter = parseHeaderParameter(part);
    if (!parameter || names.has(parameter.name)) return fail("header", "Parameters must have unique valid names.", "malformed_header");
    names.add(parameter.name); parameters.push(parameter);
  }
  const output: ContentTypeParserOutput = {mediaType: parts[0].toLowerCase(), parameters};
  if (!matchesToolJsonSchema(output, contentTypeParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const contentTypeParserTool = defineTool<ContentTypeParserInput, ContentTypeParserOutput>({
  id: "http/content-type-parser", title: "HTTP Content-Type Parser", description: "Parse an HTTP media type and its parameters, preserving parameter values and rejecting duplicate names.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateContentTypeParser,
  inputSchema: contentTypeParserInputSchema, outputSchema: contentTypeParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Content-Type field value","description":"Content-Type field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"mediaType","label":"Lowercase media type","description":"Lowercase media type.","valueType":{"type":"string"}},{"id":"parameters","label":"Parameters in source order with unquoted values","description":"Parameters in source order with unquoted values.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runContentTypeParser = contentTypeParserTool.execute;
export const example = {"input":{"header":"Text/HTML; charset=\"UTF-8\"; boundary=\"a;b\""},"output":{"mediaType":"text/html","parameters":[{"name":"charset","value":"UTF-8"},{"name":"boundary","value":"a;b"}]}} satisfies ToolExample<ContentTypeParserInput, ContentTypeParserOutput>;
export default contentTypeParserTool;
