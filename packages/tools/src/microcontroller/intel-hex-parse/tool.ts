import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.keil.com/support/docs/1584.htm
export type IntelHexParseInput = {
  readonly line: string;
};
export type IntelHexParseOutput = {
  readonly recordType: number;
  readonly address: number;
  readonly data: readonly number[];
  readonly checksum: number;
};
export const intelHexParseInputSchema = {"type":"object","additionalProperties":false,"properties":{"line":{"type":"string","maxLength":1000000,"description":"One Intel HEX record."}},"required":["line"]} as const satisfies ToolJsonSchema;
export const intelHexParseOutputSchema = {"type":"object","additionalProperties":false,"properties":{"recordType":{"type":"integer","minimum":0,"maximum":5,"description":"Record type from 0 through 5."},"address":{"type":"integer","minimum":0,"maximum":65535,"description":"Sixteen-bit record address."},"data":{"type":"array","items":{"type":"integer","minimum":0,"maximum":255},"minItems":0,"maxItems":255,"description":"Record payload bytes."},"checksum":{"type":"integer","minimum":0,"maximum":255,"description":"Record checksum byte."}},"required":["recordType","address","data","checksum"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const validIntelHexShape=(type:number,address:number,length:number):boolean=>{
  const lengths:Readonly<Record<number,number>>={1:0,2:2,3:4,4:2,5:4};
  return type===0 || (address===0&&length===lengths[type]);
};

export const calculateIntelHexParse = (input: unknown): ToolResult<IntelHexParseOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = intelHexParseInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, intelHexParseInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["line"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: IntelHexParseInput = {
    line: values.line as string
  };
  const line=x.line.trim();if(!/^:(?:[0-9A-Fa-f]{2}){5,260}$/.test(line))return fail("line","Provide one colon-prefixed hexadecimal record.","malformed_record");
  const bytes=(line.slice(1).match(/../g)??[]).map(value=>Number.parseInt(value,16));
  if(bytes[0]+5!==bytes.length)return fail("line","Record byte count does not match the payload.","invalid_byte_count");
  if(bytes.reduce((sum,byte)=>(sum+byte)&255,0)!==0)return fail("line","Record checksum does not match.","invalid_checksum");
  const recordType=bytes[3],address=bytes[1]*256+bytes[2],data=bytes.slice(4,-1),checksum=bytes[bytes.length-1];
  if(recordType>5||!validIntelHexShape(recordType,address,data.length))return fail("line","Unsupported type or invalid control-record shape.","invalid_record_type");
  const output: IntelHexParseOutput = {recordType,address,data,checksum};
  if (!matchesToolJsonSchema(output, intelHexParseOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const intelHexParseTool = defineTool<IntelHexParseInput, IntelHexParseOutput>({
  id: "microcontroller/intel-hex-parse", title: "Intel HEX Record Parser", description: "Parse one Intel HEX record and verify its byte count, two-complement checksum, record type, and control-record shape.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateIntelHexParse,
  inputSchema: intelHexParseInputSchema, outputSchema: intelHexParseOutputSchema,
  ports: {inputs: [{"id":"line","label":"One Intel HEX record","description":"One Intel HEX record.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"recordType","label":"Record type from 0 through 5","description":"Record type from 0 through 5.","valueType":{"type":"integer"}},{"id":"address","label":"Sixteen-bit record address","description":"Sixteen-bit record address.","valueType":{"type":"integer"}},{"id":"data","label":"Record payload bytes","description":"Record payload bytes.","valueType":{"type":"list","items":{"type":"integer"}}},{"id":"checksum","label":"Record checksum byte","description":"Record checksum byte.","valueType":{"type":"integer"}}]},
});
export const runIntelHexParse = intelHexParseTool.execute;
export const example = {"input":{"line":":0401000001020304F1"},"output":{"recordType":0,"address":256,"data":[1,2,3,4],"checksum":241}} satisfies ToolExample<IntelHexParseInput, IntelHexParseOutput>;
export default intelHexParseTool;
