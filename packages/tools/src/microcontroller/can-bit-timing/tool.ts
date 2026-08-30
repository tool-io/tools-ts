import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://software-dl.ti.com/ra-processors/esd/MMWAVE-L-SDK/05_02_00_02/exports/docs/api_guide_xwrL64xx/DRIVERS_MCAN_PAGE.html
export type CanBitTimingInput = {
  readonly clockHz: number;
  readonly prescaler: number;
  readonly segment1: number;
  readonly segment2: number;
};
export type CanBitTimingOutput = {
  readonly bitrate: number;
  readonly samplePointPercent: number;
  readonly quantumSeconds: number;
};
export const canBitTimingInputSchema = {"type":"object","additionalProperties":false,"properties":{"clockHz":{"type":"number","exclusiveMinimum":0,"description":"CAN controller clock frequency."},"prescaler":{"type":"integer","minimum":1,"maximum":65536,"description":"Effective clock divisor, not an encoded register value."},"segment1":{"type":"integer","minimum":1,"maximum":65536,"description":"Quanta before the sample point excluding synchronization."},"segment2":{"type":"integer","minimum":1,"maximum":65536,"description":"Quanta after the sample point."}},"required":["clockHz","prescaler","segment1","segment2"]} as const satisfies ToolJsonSchema;
export const canBitTimingOutputSchema = {"type":"object","additionalProperties":false,"properties":{"bitrate":{"type":"number","exclusiveMinimum":0,"description":"Nominal bit rate."},"samplePointPercent":{"type":"number","minimum":0,"maximum":100,"description":"Sample point as a percentage of the bit time."},"quantumSeconds":{"type":"number","exclusiveMinimum":0,"description":"Time quantum duration."}},"required":["bitrate","samplePointPercent","quantumSeconds"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCanBitTiming = (input: unknown): ToolResult<CanBitTimingOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = canBitTimingInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, canBitTimingInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["clockHz","prescaler","segment1","segment2"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CanBitTimingInput = {
    clockHz: values.clockHz as number,
    prescaler: values.prescaler as number,
    segment1: values.segment1 as number,
    segment2: values.segment2 as number
  };
  const total=1+x.segment1+x.segment2;
  const output: CanBitTimingOutput = {bitrate:x.clockHz/x.prescaler/total,samplePointPercent:(1+x.segment1)/total*100,quantumSeconds:x.prescaler/x.clockHz};
  if (!matchesToolJsonSchema(output, canBitTimingOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const canBitTimingTool = defineTool<CanBitTimingInput, CanBitTimingOutput>({
  id: "microcontroller/can-bit-timing", title: "CAN Bit Timing Calculator", description: "Calculate nominal CAN bitrate and sample point from effective prescaler and segment lengths, including the one-quantum synchronization segment.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCanBitTiming,
  inputSchema: canBitTimingInputSchema, outputSchema: canBitTimingOutputSchema,
  ports: {inputs: [{"id":"clockHz","label":"CAN controller clock frequency","description":"CAN controller clock frequency.","valueType":{"type":"number","unit":"Hz"},"required":true},{"id":"prescaler","label":"Effective clock divisor, not an encoded register value","description":"Effective clock divisor, not an encoded register value.","valueType":{"type":"integer"},"required":true},{"id":"segment1","label":"Quanta before the sample point excluding synchronization","description":"Quanta before the sample point excluding synchronization.","valueType":{"type":"integer"},"required":true},{"id":"segment2","label":"Quanta after the sample point","description":"Quanta after the sample point.","valueType":{"type":"integer"},"required":true}], outputs: [{"id":"bitrate","label":"Nominal bit rate","description":"Nominal bit rate.","valueType":{"type":"number","unit":"bit/s"}},{"id":"samplePointPercent","label":"Sample point as a percentage of the bit time","description":"Sample point as a percentage of the bit time.","valueType":{"type":"number","unit":"%"}},{"id":"quantumSeconds","label":"Time quantum duration","description":"Time quantum duration.","valueType":{"type":"number","unit":"s"}}]},
});
export const runCanBitTiming = canBitTimingTool.execute;
export const example = {"input":{"clockHz":8000000,"prescaler":1,"segment1":11,"segment2":4},"output":{"bitrate":500000,"samplePointPercent":75,"quantumSeconds":1.25e-07}} satisfies ToolExample<CanBitTimingInput, CanBitTimingOutput>;
export default canBitTimingTool;
