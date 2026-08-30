import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://developer.arm.com/documentation/dui0553/latest/
export type ClockDividerFinderInput = {
  readonly clockHz: number;
  readonly targetHz: number;
  readonly maximumDivider: number;
};
export type ClockDividerFinderOutput = {
  readonly divider: number;
  readonly actualHz: number;
  readonly errorPercent: number;
};
export const clockDividerFinderInputSchema = {"type":"object","additionalProperties":false,"properties":{"clockHz":{"type":"number","exclusiveMinimum":0,"description":"Input clock frequency."},"targetHz":{"type":"number","exclusiveMinimum":0,"description":"Target output frequency."},"maximumDivider":{"type":"integer","minimum":1,"maximum":4294967295,"description":"Largest supported effective divisor."}},"required":["clockHz","targetHz","maximumDivider"]} as const satisfies ToolJsonSchema;
export const clockDividerFinderOutputSchema = {"type":"object","additionalProperties":false,"properties":{"divider":{"type":"integer","minimum":1,"description":"Selected effective divisor."},"actualHz":{"type":"number","exclusiveMinimum":0,"description":"Achieved output frequency."},"errorPercent":{"type":"number","description":"Signed frequency error relative to the target."}},"required":["divider","actualHz","errorPercent"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateClockDividerFinder = (input: unknown): ToolResult<ClockDividerFinderOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = clockDividerFinderInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, clockDividerFinderInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["clockHz","targetHz","maximumDivider"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ClockDividerFinderInput = {
    clockHz: values.clockHz as number,
    targetHz: values.targetHz as number,
    maximumDivider: values.maximumDivider as number
  };
  const ideal=x.clockHz/x.targetHz,clamp=(value:number)=>Math.max(1,Math.min(x.maximumDivider,value));
  const low=clamp(Math.floor(ideal)),high=clamp(Math.ceil(ideal));
  const divider=Math.abs(x.clockHz/low-x.targetHz)<=Math.abs(x.clockHz/high-x.targetHz)?low:high;
  const actualHz=x.clockHz/divider;
  const output: ClockDividerFinderOutput = {divider,actualHz,errorPercent:(actualHz-x.targetHz)/x.targetHz*100};
  if (!matchesToolJsonSchema(output, clockDividerFinderOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const clockDividerFinderTool = defineTool<ClockDividerFinderInput, ClockDividerFinderOutput>({
  id: "microcontroller/clock-divider-finder", title: "Integer Clock Divider Finder", description: "Find the bounded positive integer divisor minimizing absolute frequency error, selecting the smaller divisor on a tie.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateClockDividerFinder,
  inputSchema: clockDividerFinderInputSchema, outputSchema: clockDividerFinderOutputSchema,
  ports: {inputs: [{"id":"clockHz","label":"Input clock frequency","description":"Input clock frequency.","valueType":{"type":"number","unit":"Hz"},"required":true},{"id":"targetHz","label":"Target output frequency","description":"Target output frequency.","valueType":{"type":"number","unit":"Hz"},"required":true},{"id":"maximumDivider","label":"Largest supported effective divisor","description":"Largest supported effective divisor.","valueType":{"type":"integer"},"required":true}], outputs: [{"id":"divider","label":"Selected effective divisor","description":"Selected effective divisor.","valueType":{"type":"integer"}},{"id":"actualHz","label":"Achieved output frequency","description":"Achieved output frequency.","valueType":{"type":"number","unit":"Hz"}},{"id":"errorPercent","label":"Signed frequency error relative to the target","description":"Signed frequency error relative to the target.","valueType":{"type":"number","unit":"%"}}]},
});
export const runClockDividerFinder = clockDividerFinderTool.execute;
export const example = {"input":{"clockHz":48000000,"targetHz":10000000,"maximumDivider":32},"output":{"divider":5,"actualHz":9600000,"errorPercent":-4}} satisfies ToolExample<ClockDividerFinderInput, ClockDividerFinderOutput>;
export default clockDividerFinderTool;
