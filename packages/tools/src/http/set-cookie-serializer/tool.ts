import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {validCookieName,validCookieValue} from "../cookie-parser/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1
export type SetCookieSerializerInput = {
  readonly name: string;
  readonly value: string;
  readonly attributes: readonly { readonly name: string; readonly value: string }[];
};
export type SetCookieSerializerOutput = {
  readonly header: string;
};
export const setCookieSerializerInputSchema = {"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000,"description":"Cookie name."},"value":{"type":"string","maxLength":1000000,"description":"Cookie value."},"attributes":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Cookie attributes; an empty value emits a flag."}},"required":["name","value","attributes"]} as const satisfies ToolJsonSchema;
export const setCookieSerializerOutputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Serialized Set-Cookie field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateSetCookieSerializer = (input: unknown): ToolResult<SetCookieSerializerOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = setCookieSerializerInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, setCookieSerializerInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["name","value","attributes"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SetCookieSerializerInput = {
    name: values.name as string,
    value: values.value as string,
    attributes: values.attributes as readonly { readonly name: string; readonly value: string }[]
  };
  if (!validCookieName(x.name)) return fail("name", "Invalid cookie name.", "malformed_cookie");
  if (!validCookieValue(x.value)) return fail("value", "Invalid cookie value.", "malformed_cookie");
  for (const attr of x.attributes) if (!validCookieName(attr.name) || /[^\x20-\x7e]|;/.test(attr.value)) return fail("attributes", "Invalid cookie attribute.", "malformed_cookie");
  const output: SetCookieSerializerOutput = {header: `${x.name}=${x.value}` + x.attributes.map(({name,value}) => `; ${name}${value === "" ? "" : "="+value}`).join("")};
  if (!matchesToolJsonSchema(output, setCookieSerializerOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const setCookieSerializerTool = defineTool<SetCookieSerializerInput, SetCookieSerializerOutput>({
  id: "http/set-cookie-serializer", title: "HTTP Set-Cookie Serializer", description: "Serialize one cookie pair and explicit attributes while rejecting characters that can create additional header fields.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSetCookieSerializer,
  inputSchema: setCookieSerializerInputSchema, outputSchema: setCookieSerializerOutputSchema,
  ports: {inputs: [{"id":"name","label":"Cookie name","description":"Cookie name.","valueType":{"type":"string"},"required":true},{"id":"value","label":"Cookie value","description":"Cookie value.","valueType":{"type":"string"},"required":true},{"id":"attributes","label":"Cookie attributes; an empty value emits a flag","description":"Cookie attributes; an empty value emits a flag.","valueType":{"type":"list","items":{"type":"object"}},"required":true}], outputs: [{"id":"header","label":"Serialized Set-Cookie field value","description":"Serialized Set-Cookie field value.","valueType":{"type":"string"}}]},
});
export const runSetCookieSerializer = setCookieSerializerTool.execute;
export const example = {"input":{"name":"theme","value":"dark","attributes":[{"name":"Path","value":"/"},{"name":"Secure","value":""}]},"output":{"header":"theme=dark; Path=/; Secure"}} satisfies ToolExample<SetCookieSerializerInput, SetCookieSerializerOutput>;
export default setCookieSerializerTool;
