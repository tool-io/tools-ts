import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.microchip.com/en-us/application-notes/an2526
export type EepromWearOffsetInput = {
  readonly memoryBytes: number;
  readonly slotBytes: number;
  readonly writeIndex: number;
};
export type EepromWearOffsetOutput = {
  readonly offsetBytes: number;
  readonly slotIndex: number;
  readonly slotCount: number;
};
export const eepromWearOffsetInputSchema = {"type":"object","additionalProperties":false,"properties":{"memoryBytes":{"type":"integer","minimum":1,"maximum":4294967295,"description":"Available EEPROM bytes."},"slotBytes":{"type":"integer","minimum":1,"maximum":4294967295,"description":"Bytes per stored record."},"writeIndex":{"type":"integer","minimum":0,"description":"Zero-based write sequence index."}},"required":["memoryBytes","slotBytes","writeIndex"]} as const satisfies ToolJsonSchema;
export const eepromWearOffsetOutputSchema = {"type":"object","additionalProperties":false,"properties":{"offsetBytes":{"type":"integer","minimum":0,"description":"Selected slot byte offset."},"slotIndex":{"type":"integer","minimum":0,"description":"Selected slot index."},"slotCount":{"type":"integer","minimum":1,"description":"Number of complete slots."}},"required":["offsetBytes","slotIndex","slotCount"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateEepromWearOffset = (input: unknown): ToolResult<EepromWearOffsetOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = eepromWearOffsetInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, eepromWearOffsetInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["memoryBytes","slotBytes","writeIndex"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: EepromWearOffsetInput = {
    memoryBytes: values.memoryBytes as number,
    slotBytes: values.slotBytes as number,
    writeIndex: values.writeIndex as number
  };
  const slotCount=Math.floor(x.memoryBytes/x.slotBytes);if(slotCount===0)return fail("slotBytes","A slot must fit in the available EEPROM.","slot_too_large");
  const slotIndex=x.writeIndex%slotCount;
  const output: EepromWearOffsetOutput = {offsetBytes:slotIndex*x.slotBytes,slotIndex,slotCount};
  if (!matchesToolJsonSchema(output, eepromWearOffsetOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const eepromWearOffsetTool = defineTool<EepromWearOffsetInput, EepromWearOffsetOutput>({
  id: "microcontroller/eeprom-wear-offset", title: "EEPROM Round Robin Slot Offset", description: "Map a zero-based write index to a fixed-size EEPROM slot using round-robin placement while leaving an incomplete trailing slot unused.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateEepromWearOffset,
  inputSchema: eepromWearOffsetInputSchema, outputSchema: eepromWearOffsetOutputSchema,
  ports: {inputs: [{"id":"memoryBytes","label":"Available EEPROM bytes","description":"Available EEPROM bytes.","valueType":{"type":"integer"},"required":true},{"id":"slotBytes","label":"Bytes per stored record","description":"Bytes per stored record.","valueType":{"type":"integer"},"required":true},{"id":"writeIndex","label":"Zero-based write sequence index","description":"Zero-based write sequence index.","valueType":{"type":"integer"},"required":true}], outputs: [{"id":"offsetBytes","label":"Selected slot byte offset","description":"Selected slot byte offset.","valueType":{"type":"integer"}},{"id":"slotIndex","label":"Selected slot index","description":"Selected slot index.","valueType":{"type":"integer"}},{"id":"slotCount","label":"Number of complete slots","description":"Number of complete slots.","valueType":{"type":"integer"}}]},
});
export const runEepromWearOffset = eepromWearOffsetTool.execute;
export const example = {"input":{"memoryBytes":64,"slotBytes":16,"writeIndex":7},"output":{"offsetBytes":48,"slotIndex":3,"slotCount":4}} satisfies ToolExample<EepromWearOffsetInput, EepromWearOffsetOutput>;
export default eepromWearOffsetTool;
