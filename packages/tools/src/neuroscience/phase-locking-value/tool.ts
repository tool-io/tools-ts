import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://mne.tools/0.21/generated/mne.connectivity.spectral_connectivity.html
export type PhaseLockingValueInput = {
  readonly phaseDifferencesRad: readonly number[];
};
export type PhaseLockingValueOutput = {
  readonly plv: number;
};
export const phaseLockingValueInputSchema = {"type":"object","additionalProperties":false,"properties":{"phaseDifferencesRad":{"type":"array","items":{"type":"number"},"minItems":1,"maxItems":100000,"description":"Paired phase differences in radians."}},"required":["phaseDifferencesRad"]} as const satisfies ToolJsonSchema;
export const phaseLockingValueOutputSchema = {"type":"object","additionalProperties":false,"properties":{"plv":{"type":"number","minimum":0,"maximum":1,"description":"Magnitude of the mean phase-difference phasor."}},"required":["plv"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculatePhaseLockingValue = (input: unknown): ToolResult<PhaseLockingValueOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = phaseLockingValueInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, phaseLockingValueInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["phaseDifferencesRad"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: PhaseLockingValueInput = {
    phaseDifferencesRad: values.phaseDifferencesRad as readonly number[]
  };
  let real = 0, imaginary = 0;
  for (const phase of x.phaseDifferencesRad) { real += Math.cos(phase); imaginary += Math.sin(phase); }
  const n = x.phaseDifferencesRad.length;
  const output: PhaseLockingValueOutput = { plv: Math.min(1, Math.hypot(real / n, imaginary / n)) };
  if (!matchesToolJsonSchema(output, phaseLockingValueOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const phaseLockingValueTool = defineTool<PhaseLockingValueInput, PhaseLockingValueOutput>({
  id: "neuroscience/phase-locking-value", title: "Phase Locking Value", description: "Calculate PLV as the magnitude of the mean unit phasor for supplied paired phase differences in radians. No phase extraction, filtering, or bias correction is performed.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculatePhaseLockingValue,
  inputSchema: phaseLockingValueInputSchema, outputSchema: phaseLockingValueOutputSchema,
  ports: {inputs: [{"id":"phaseDifferencesRad","label":"Paired phase differences in radians","description":"Paired phase differences in radians.","valueType":{"type":"list","items":{"type":"number"},"unit":"rad"},"required":true}], outputs: [{"id":"plv","label":"Magnitude of the mean phase-difference phasor","description":"Magnitude of the mean phase-difference phasor.","valueType":{"type":"number"}}]},
});
export const runPhaseLockingValue = phaseLockingValueTool.execute;
export const example = {"input":{"phaseDifferencesRad":[0,1.5707963267948966]},"output":{"plv":0.7071067811865476}} satisfies ToolExample<PhaseLockingValueInput, PhaseLockingValueOutput>;
export default phaseLockingValueTool;
