import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://pmc.ncbi.nlm.nih.gov/articles/PMC5053993/
export type WorkingMemoryCapacityCowanInput = {
  readonly setSize: number;
  readonly hitRate: number;
  readonly falseAlarmRate: number;
};
export type WorkingMemoryCapacityCowanOutput = {
  readonly capacityItems: number;
};
export const workingMemoryCapacityCowanInputSchema = {"type":"object","additionalProperties":false,"properties":{"setSize":{"type":"integer","minimum":1,"description":"Number of items in the memory set."},"hitRate":{"type":"number","minimum":0,"maximum":1,"description":"Fraction of change trials correctly detected."},"falseAlarmRate":{"type":"number","minimum":0,"maximum":1,"description":"Fraction of no-change trials incorrectly called change."}},"required":["setSize","hitRate","falseAlarmRate"]} as const satisfies ToolJsonSchema;
export const workingMemoryCapacityCowanOutputSchema = {"type":"object","additionalProperties":false,"properties":{"capacityItems":{"type":"number","description":"Signed Cowan K estimate."}},"required":["capacityItems"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateWorkingMemoryCapacityCowan = (input: unknown): ToolResult<WorkingMemoryCapacityCowanOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = workingMemoryCapacityCowanInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, workingMemoryCapacityCowanInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["setSize","hitRate","falseAlarmRate"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: WorkingMemoryCapacityCowanInput = {
    setSize: values.setSize as number,
    hitRate: values.hitRate as number,
    falseAlarmRate: values.falseAlarmRate as number
  };
  const output: WorkingMemoryCapacityCowanOutput = { capacityItems: x.setSize * (x.hitRate - x.falseAlarmRate) };
  if (!matchesToolJsonSchema(output, workingMemoryCapacityCowanOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const workingMemoryCapacityCowanTool = defineTool<WorkingMemoryCapacityCowanInput, WorkingMemoryCapacityCowanOutput>({
  id: "neuroscience/working-memory-capacity-cowan", title: "Cowan Working Memory Capacity", description: "Calculate the change-detection estimate K = setSize × (hitRate − falseAlarmRate), with rates as fractions. Preserve negative estimates without clipping; the caller supplies task-appropriate rates.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateWorkingMemoryCapacityCowan,
  inputSchema: workingMemoryCapacityCowanInputSchema, outputSchema: workingMemoryCapacityCowanOutputSchema,
  ports: {inputs: [{"id":"setSize","label":"Number of items in the memory set","description":"Number of items in the memory set.","valueType":{"type":"integer"},"required":true},{"id":"hitRate","label":"Fraction of change trials correctly detected","description":"Fraction of change trials correctly detected.","valueType":{"type":"number"},"required":true},{"id":"falseAlarmRate","label":"Fraction of no-change trials incorrectly called change","description":"Fraction of no-change trials incorrectly called change.","valueType":{"type":"number"},"required":true}], outputs: [{"id":"capacityItems","label":"Signed Cowan K estimate","description":"Signed Cowan K estimate.","valueType":{"type":"number","unit":"item"}}]},
});
export const runWorkingMemoryCapacityCowan = workingMemoryCapacityCowanTool.execute;
export const example = {"input":{"setSize":4,"hitRate":0.9,"falseAlarmRate":0.15},"output":{"capacityItems":3}} satisfies ToolExample<WorkingMemoryCapacityCowanInput, WorkingMemoryCapacityCowanOutput>;
export default workingMemoryCapacityCowanTool;
