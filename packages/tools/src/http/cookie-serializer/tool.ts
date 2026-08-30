import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {validCookieName,validCookieValue} from "../cookie-parser/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc6265.html#section-4.2
export type CookieSerializerInput = {
  readonly cookies: readonly { readonly name: string; readonly value: string }[];
};
export type CookieSerializerOutput = {
  readonly header: string;
};
export const cookieSerializerInputSchema = {"type":"object","additionalProperties":false,"properties":{"cookies":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Cookie pairs to serialize."}},"required":["cookies"]} as const satisfies ToolJsonSchema;
export const cookieSerializerOutputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Serialized Cookie field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCookieSerializer = (input: unknown): ToolResult<CookieSerializerOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = cookieSerializerInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, cookieSerializerInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["cookies"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CookieSerializerInput = {
    cookies: values.cookies as readonly { readonly name: string; readonly value: string }[]
  };
  for (const cookie of x.cookies) if (!validCookieName(cookie.name) || !validCookieValue(cookie.value)) return fail("cookies", "Cookie names and values must use valid cookie octets.", "malformed_cookie");
  const output: CookieSerializerOutput = {header: x.cookies.map(({name,value}) => `${name}=${value}`).join("; ")};
  if (!matchesToolJsonSchema(output, cookieSerializerOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const cookieSerializerTool = defineTool<CookieSerializerInput, CookieSerializerOutput>({
  id: "http/cookie-serializer", title: "HTTP Cookie Serializer", description: "Serialize ordered cookie pairs using RFC 6265 cookie octets without implicit escaping or decoding.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCookieSerializer,
  inputSchema: cookieSerializerInputSchema, outputSchema: cookieSerializerOutputSchema,
  ports: {inputs: [{"id":"cookies","label":"Cookie pairs to serialize","description":"Cookie pairs to serialize.","valueType":{"type":"list","items":{"type":"object"}},"required":true}], outputs: [{"id":"header","label":"Serialized Cookie field value","description":"Serialized Cookie field value.","valueType":{"type":"string"}}]},
});
export const runCookieSerializer = cookieSerializerTool.execute;
export const example = {"input":{"cookies":[{"name":"session","value":"abc%20123"},{"name":"theme","value":"dark"}]},"output":{"header":"session=abc%20123; theme=dark"}} satisfies ToolExample<CookieSerializerInput, CookieSerializerOutput>;
export default cookieSerializerTool;
