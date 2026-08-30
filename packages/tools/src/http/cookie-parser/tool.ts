import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.rfc-editor.org/rfc/rfc6265.html#section-4.2
export type CookieParserInput = {
  readonly header: string;
};
export type CookieParserOutput = {
  readonly cookies: readonly { readonly name: string; readonly value: string }[];
};
export const cookieParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Cookie field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const cookieParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"cookies":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Cookie pairs in source order."}},"required":["cookies"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const validCookieName = (name: string): boolean => /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name);
export const validCookieValue = (value: string): boolean => /^[\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*$/.test(value);
export const parseCookiePair = (pair: string): {readonly name: string; readonly value: string} | null => {
  const eq = pair.indexOf("="); if (eq < 1) return null;
  const name = pair.slice(0, eq).trim(); let value = pair.slice(eq+1).trim();
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) value = value.slice(1,-1);
  return validCookieName(name) && validCookieValue(value) ? {name,value} : null;
};

export const calculateCookieParser = (input: unknown): ToolResult<CookieParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = cookieParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, cookieParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CookieParserInput = {
    header: values.header as string
  };
  if (/[\x00-\x1f\x7f]/.test(x.header))
    return fail(
      "header",
      "Invalid header control character.",
      "malformed_cookie",
    );
  const cookies: {name: string; value: string}[] = [];
  if (x.header.trim() !== "") for (const part of x.header.split(";")) {
    const pair = parseCookiePair(part);
    if (!pair) return fail("header", "Invalid cookie pair.", "malformed_cookie");
    cookies.push(pair);
  }
  const output: CookieParserOutput = {cookies};
  if (!matchesToolJsonSchema(output, cookieParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const cookieParserTool = defineTool<CookieParserInput, CookieParserOutput>({
  id: "http/cookie-parser", title: "HTTP Cookie Parser", description: "Parse a Cookie header into ordered name and value pairs while preserving duplicate cookie names and encoded values.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCookieParser,
  inputSchema: cookieParserInputSchema, outputSchema: cookieParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Cookie field value","description":"Cookie field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"cookies","label":"Cookie pairs in source order","description":"Cookie pairs in source order.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runCookieParser = cookieParserTool.execute;
export const example = {"input":{"header":"session=abc%20123; theme=dark; session=second"},"output":{"cookies":[{"name":"session","value":"abc%20123"},{"name":"theme","value":"dark"},{"name":"session","value":"second"}]}} satisfies ToolExample<CookieParserInput, CookieParserOutput>;
export default cookieParserTool;
