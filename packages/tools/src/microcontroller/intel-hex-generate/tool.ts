import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {validIntelHexShape} from "../intel-hex-parse/tool.js";
// Method reference: https://www.keil.com/support/docs/1584.htm
export type IntelHexGenerateInput = {
  readonly recordType: number;
  readonly address: number;
  readonly data: readonly number[];
};
export type IntelHexGenerateOutput = {
  readonly line: string;
};
export const intelHexGenerateInputSchema = {"type":"object","additionalProperties":false,"properties":{"recordType":{"type":"integer","minimum":0,"maximum":5,"description":"Record type from 0 through 5."},"address":{"type":"integer","minimum":0,"maximum":65535,"description":"Sixteen-bit record address."},"data":{"type":"array","items":{"type":"integer","minimum":0,"maximum":255},"minItems":0,"maxItems":255,"description":"Record payload bytes."}},"required":["recordType","address","data"]} as const satisfies ToolJsonSchema;
export const intelHexGenerateOutputSchema = {"type":"object","additionalProperties":false,"properties":{"line":{"type":"string","maxLength":1000000,"description":"Uppercase Intel HEX record."}},"required":["line"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateIntelHexGenerate = (input: unknown): ToolResult<IntelHexGenerateOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = intelHexGenerateInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, intelHexGenerateInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["recordType","address","data"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: IntelHexGenerateInput = {
    recordType: values.recordType as number,
    address: values.address as number,
    data: values.data as readonly number[]
  };
  if(!validIntelHexShape(x.recordType,x.address,x.data.length))return fail("data","Control records require a zero address and their prescribed payload length.","invalid_record_shape");
  const bytes=[x.data.length,Math.floor(x.address/256),x.address%256,x.recordType,...x.data];
  const checksum=(-bytes.reduce((sum,byte)=>(sum+byte)&255,0))&255;
  const output: IntelHexGenerateOutput = {line:":"+[...bytes,checksum].map(byte=>byte.toString(16).toUpperCase().padStart(2,"0")).join("")};
  if (!matchesToolJsonSchema(output, intelHexGenerateOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const intelHexGenerateTool = defineTool<IntelHexGenerateInput, IntelHexGenerateOutput>({
  id: "microcontroller/intel-hex-generate", title: "Intel HEX Record Generator", description: "Serialize explicit bytes as one Intel HEX record with a computed byte count and checksum, enforcing control-record shapes.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateIntelHexGenerate,
  inputSchema: intelHexGenerateInputSchema, outputSchema: intelHexGenerateOutputSchema,
  ports: {inputs: [{"id":"recordType","label":"Record type from 0 through 5","description":"Record type from 0 through 5.","valueType":{"type":"integer"},"required":true},{"id":"address","label":"Sixteen-bit record address","description":"Sixteen-bit record address.","valueType":{"type":"integer"},"required":true},{"id":"data","label":"Record payload bytes","description":"Record payload bytes.","valueType":{"type":"list","items":{"type":"integer"}},"required":true}], outputs: [{"id":"line","label":"Uppercase Intel HEX record","description":"Uppercase Intel HEX record.","valueType":{"type":"string"}}]},
});
export const runIntelHexGenerate = intelHexGenerateTool.execute;
export const example = {"input":{"recordType":0,"address":256,"data":[1,2,3,4]},"output":{"line":":0401000001020304F1"}} satisfies ToolExample<IntelHexGenerateInput, IntelHexGenerateOutput>;
export default intelHexGenerateTool;
