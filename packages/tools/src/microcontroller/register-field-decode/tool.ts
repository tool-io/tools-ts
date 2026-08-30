import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://developer.arm.com/documentation/dui0553/latest/
export type RegisterFieldDecodeInput = {
  readonly register: number;
  readonly offset: number;
  readonly width: number;
};
export type RegisterFieldDecodeOutput = {
  readonly value: number;
};
export const registerFieldDecodeInputSchema = {"type":"object","additionalProperties":false,"properties":{"register":{"type":"integer","minimum":0,"maximum":4294967295,"description":"Unsigned 32-bit register value."},"offset":{"type":"integer","minimum":0,"maximum":31,"description":"Least-significant bit offset."},"width":{"type":"integer","minimum":1,"maximum":32,"description":"Field width in bits."}},"required":["register","offset","width"]} as const satisfies ToolJsonSchema;
export const registerFieldDecodeOutputSchema = {"type":"object","additionalProperties":false,"properties":{"value":{"type":"integer","minimum":0,"maximum":4294967295,"description":"Unsigned result."}},"required":["value"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateRegisterFieldDecode = (input: unknown): ToolResult<RegisterFieldDecodeOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = registerFieldDecodeInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, registerFieldDecodeInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["register","offset","width"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: RegisterFieldDecodeInput = {
    register: values.register as number,
    offset: values.offset as number,
    width: values.width as number
  };
  if(x.offset+x.width>32)return fail("width","The field extends beyond the register.","field_out_of_range");
  const mask=(1n<<BigInt(x.width))-1n,shift=BigInt(x.offset),register=BigInt(x.register);
  const output: RegisterFieldDecodeOutput = {value:Number((register>>shift)&mask)};
  if (!matchesToolJsonSchema(output, registerFieldDecodeOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const registerFieldDecodeTool = defineTool<RegisterFieldDecodeInput, RegisterFieldDecodeOutput>({
  id: "microcontroller/register-field-decode", title: "Register Field Decoder", description: "Extract an unsigned 32-bit register field using exact integer bit operations and explicit field bounds.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateRegisterFieldDecode,
  inputSchema: registerFieldDecodeInputSchema, outputSchema: registerFieldDecodeOutputSchema,
  ports: {inputs: [{"id":"register","label":"Unsigned 32-bit register value","description":"Unsigned 32-bit register value.","valueType":{"type":"integer"},"required":true},{"id":"offset","label":"Least-significant bit offset","description":"Least-significant bit offset.","valueType":{"type":"integer"},"required":true},{"id":"width","label":"Field width in bits","description":"Field width in bits.","valueType":{"type":"integer"},"required":true}], outputs: [{"id":"value","label":"Unsigned result","description":"Unsigned result.","valueType":{"type":"integer"}}]},
});
export const runRegisterFieldDecode = registerFieldDecodeTool.execute;
export const example = {"input":{"register":4294901760,"offset":4,"width":8},"output":{"value":0}} satisfies ToolExample<RegisterFieldDecodeInput, RegisterFieldDecodeOutput>;
export default registerFieldDecodeTool;
