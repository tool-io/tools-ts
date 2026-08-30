import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.nxp.com/docs/en/reference-manual/M68000PRM.pdf
export type SrecParseInput = {
  readonly line: string;
};
export type SrecParseOutput = {
  readonly recordType: number;
  readonly address: number;
  readonly data: readonly number[];
  readonly checksum: number;
};
export const srecParseInputSchema = {"type":"object","additionalProperties":false,"properties":{"line":{"type":"string","maxLength":1000000,"description":"One Motorola S-record."}},"required":["line"]} as const satisfies ToolJsonSchema;
export const srecParseOutputSchema = {"type":"object","additionalProperties":false,"properties":{"recordType":{"type":"integer","minimum":0,"maximum":9,"description":"S-record type."},"address":{"type":"integer","minimum":0,"maximum":4294967295,"description":"Unsigned address or count value."},"data":{"type":"array","items":{"type":"integer","minimum":0,"maximum":255},"minItems":0,"maxItems":252,"description":"Record payload bytes."},"checksum":{"type":"integer","minimum":0,"maximum":255,"description":"Record checksum byte."}},"required":["recordType","address","data","checksum"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateSrecParse = (input: unknown): ToolResult<SrecParseOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = srecParseInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, srecParseInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["line"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SrecParseInput = {
    line: values.line as string
  };
  const line=x.line.trim();if(!/^S[0-9](?:[0-9A-Fa-f]{2}){3,256}$/.test(line))return fail("line","Provide one S-record.","malformed_record");
  const recordType=Number(line[1]),widths:Readonly<Record<number,number>>={0:2,1:2,2:3,3:4,5:2,6:3,7:4,8:3,9:2},width=widths[recordType];
  if(width===undefined)return fail("line","Reserved S-record type.","invalid_record_type");
  const bytes=(line.slice(2).match(/../g)??[]).map(value=>Number.parseInt(value,16));
  if(bytes[0]+1!==bytes.length||bytes[0]<width+1)return fail("line","Record byte count does not match.","invalid_byte_count");
  if(bytes.reduce((sum,byte)=>(sum+byte)&255,0)!==255)return fail("line","Record checksum does not match.","invalid_checksum");
  const address=bytes.slice(1,width+1).reduce((sum,byte)=>sum*256+byte,0),data=bytes.slice(width+1,-1),checksum=bytes[bytes.length-1];
  if(recordType>=5&&data.length!==0)return fail("line","Count and termination records cannot contain data.","invalid_record_shape");
  const output: SrecParseOutput = {recordType,address,data,checksum};
  if (!matchesToolJsonSchema(output, srecParseOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const srecParseTool = defineTool<SrecParseInput, SrecParseOutput>({
  id: "microcontroller/srec-parse", title: "Motorola S-Record Parser", description: "Parse a Motorola S-record, checking its count, address width, ones-complement checksum, and record-type payload constraints.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSrecParse,
  inputSchema: srecParseInputSchema, outputSchema: srecParseOutputSchema,
  ports: {inputs: [{"id":"line","label":"One Motorola S-record","description":"One Motorola S-record.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"recordType","label":"S-record type","description":"S-record type.","valueType":{"type":"integer"}},{"id":"address","label":"Unsigned address or count value","description":"Unsigned address or count value.","valueType":{"type":"integer"}},{"id":"data","label":"Record payload bytes","description":"Record payload bytes.","valueType":{"type":"list","items":{"type":"integer"}}},{"id":"checksum","label":"Record checksum byte","description":"Record checksum byte.","valueType":{"type":"integer"}}]},
});
export const runSrecParse = srecParseTool.execute;
export const example = {"input":{"line":"S10512340102B1"},"output":{"recordType":1,"address":4660,"data":[1,2],"checksum":177}} satisfies ToolExample<SrecParseInput, SrecParseOutput>;
export default srecParseTool;
