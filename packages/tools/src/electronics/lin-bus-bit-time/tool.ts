import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://ww1.microchip.com/downloads/en/DeviceDoc/LIN-Protocol-Support-on-UART-Modules-40002076A.pdf
export type LinBusBitTimeInput = {
  readonly bitRateBps: number;
};
export type LinBusBitTimeOutput = {
  readonly bitTimeMicroseconds: number;
};
export const linBusBitTimeInputSchema = {"type":"object","additionalProperties":false,"properties":{"bitRateBps":{"type":"number","minimum":1000,"maximum":20000,"description":"Nominal LIN bit rate."}},"required":["bitRateBps"]} as const satisfies ToolJsonSchema;
export const linBusBitTimeOutputSchema = {"type":"object","additionalProperties":false,"properties":{"bitTimeMicroseconds":{"type":"number","exclusiveMinimum":0,"description":"Nominal duration of one bit."}},"required":["bitTimeMicroseconds"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateLinBusBitTime = (input: unknown): ToolResult<LinBusBitTimeOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = linBusBitTimeInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, linBusBitTimeInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["bitRateBps"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: LinBusBitTimeInput = {
    bitRateBps: values.bitRateBps as number
  };
  const output: LinBusBitTimeOutput = { bitTimeMicroseconds: 1e6 / x.bitRateBps };
  if (!matchesToolJsonSchema(output, linBusBitTimeOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const linBusBitTimeTool = defineTool<LinBusBitTimeInput, LinBusBitTimeOutput>({
  id: "electronics/lin-bus-bit-time", title: "LIN Bus Bit Time", description: "Calculate nominal LIN bit duration as 1e6 / bit rate in microseconds, for the documented 1–20 kbit/s range. Frame overhead and clock tolerance are excluded.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateLinBusBitTime,
  inputSchema: linBusBitTimeInputSchema, outputSchema: linBusBitTimeOutputSchema,
  ports: {inputs: [{"id":"bitRateBps","label":"Nominal LIN bit rate","description":"Nominal LIN bit rate.","valueType":{"type":"number","unit":"bit/s"},"required":true}], outputs: [{"id":"bitTimeMicroseconds","label":"Nominal duration of one bit","description":"Nominal duration of one bit.","valueType":{"type":"number","unit":"us"}}]},
});
export const runLinBusBitTime = linBusBitTimeTool.execute;
export const example = {"input":{"bitRateBps":20000},"output":{"bitTimeMicroseconds":50}} satisfies ToolExample<LinBusBitTimeInput, LinBusBitTimeOutput>;
export default linBusBitTimeTool;
