import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {parseCookiePair,validCookieName} from "../cookie-parser/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1
export type SetCookieParserInput = {
  readonly header: string;
};
export type SetCookieParserOutput = {
  readonly name: string;
  readonly value: string;
  readonly attributes: readonly { readonly name: string; readonly value: string }[];
};
export const setCookieParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"One Set-Cookie field value; combined fields are not supported."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const setCookieParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000,"description":"Cookie name."},"value":{"type":"string","maxLength":1000000,"description":"Cookie value."},"attributes":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Attributes with lowercase names and empty values for flags."}},"required":["name","value","attributes"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateSetCookieParser = (input: unknown): ToolResult<SetCookieParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = setCookieParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, setCookieParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SetCookieParserInput = {
    header: values.header as string
  };
  if (/[\r\n\x00]/.test(x.header)) return fail("header", "Control characters are not allowed.", "malformed_cookie");
  const parts = x.header.split(";"); const pair = parseCookiePair(parts[0]);
  if (!pair) return fail("header", "Invalid cookie pair.", "malformed_cookie");
  const attributes: {name: string; value: string}[] = [];
  for (const part of parts.slice(1)) {
    const eq = part.indexOf("="); const name = (eq < 0 ? part : part.slice(0,eq)).trim().toLowerCase();
    const value = eq < 0 ? "" : part.slice(eq+1).trim();
    if (!validCookieName(name) || /[^\x20-\x7e]/.test(value)) return fail("header", "Invalid cookie attribute.", "malformed_cookie");
    attributes.push({name,value});
  }
  const output: SetCookieParserOutput = {...pair,attributes};
  if (!matchesToolJsonSchema(output, setCookieParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const setCookieParserTool = defineTool<SetCookieParserInput, SetCookieParserOutput>({
  id: "http/set-cookie-parser", title: "HTTP Set-Cookie Parser", description: "Parse one Set-Cookie field into its cookie pair and ordered attributes, preserving extensions and Expires text.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSetCookieParser,
  inputSchema: setCookieParserInputSchema, outputSchema: setCookieParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"One Set-Cookie field value; combined fields are not supported","description":"One Set-Cookie field value; combined fields are not supported.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"name","label":"Cookie name","description":"Cookie name.","valueType":{"type":"string"}},{"id":"value","label":"Cookie value","description":"Cookie value.","valueType":{"type":"string"}},{"id":"attributes","label":"Attributes with lowercase names and empty values for flags","description":"Attributes with lowercase names and empty values for flags.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runSetCookieParser = setCookieParserTool.execute;
export const example = {"input":{"header":"session=abc; Path=/; Secure; HttpOnly; SameSite=Lax"},"output":{"name":"session","value":"abc","attributes":[{"name":"path","value":"/"},{"name":"secure","value":""},{"name":"httponly","value":""},{"name":"samesite","value":"Lax"}]}} satisfies ToolExample<SetCookieParserInput, SetCookieParserOutput>;
export default setCookieParserTool;
