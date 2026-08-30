import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://html.spec.whatwg.org/multipage/syntax.html#character-references
export type EmailObfuscatorInput = {
  readonly email: string;
};
export type EmailObfuscatorOutput = {
  readonly encoded: string;
};
export const emailObfuscatorInputSchema = {"type":"object","additionalProperties":false,"properties":{"email":{"type":"string","maxLength":1000000,"description":"Email address to encode."}},"required":["email"]} as const satisfies ToolJsonSchema;
export const emailObfuscatorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"encoded":{"type":"string","maxLength":1000000,"description":"HTML numeric character references."}},"required":["encoded"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateEmailObfuscator = (input: unknown): ToolResult<EmailObfuscatorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = emailObfuscatorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, emailObfuscatorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["email"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: EmailObfuscatorInput = {
    email: values.email as string
  };
  if (!/^[^\s@]+@[^\s@]+$/.test(x.email)) return fail("email", "Provide an address with one @ and no whitespace.", "malformed_email");
  const output: EmailObfuscatorOutput = {encoded: Array.from(x.email, char => `&#${char.codePointAt(0)};`).join("")};
  if (!matchesToolJsonSchema(output, emailObfuscatorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const emailObfuscatorTool = defineTool<EmailObfuscatorInput, EmailObfuscatorOutput>({
  id: "web/email-obfuscator", title: "Email HTML Entity Obfuscator", description: "Encode each email-address code point as a decimal HTML character reference for presentation, without claiming spam protection.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateEmailObfuscator,
  inputSchema: emailObfuscatorInputSchema, outputSchema: emailObfuscatorOutputSchema,
  ports: {inputs: [{"id":"email","label":"Email address to encode","description":"Email address to encode.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"encoded","label":"HTML numeric character references","description":"HTML numeric character references.","valueType":{"type":"string"}}]},
});
export const runEmailObfuscator = emailObfuscatorTool.execute;
export const example = {"input":{"email":"a@example.com"},"output":{"encoded":"&#97;&#64;&#101;&#120;&#97;&#109;&#112;&#108;&#101;&#46;&#99;&#111;&#109;"}} satisfies ToolExample<EmailObfuscatorInput, EmailObfuscatorOutput>;
export default emailObfuscatorTool;
