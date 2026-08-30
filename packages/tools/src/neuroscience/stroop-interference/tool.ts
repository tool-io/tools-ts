import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0076580
export type StroopInterferenceInput = {
  readonly meanIncongruentMs: number;
  readonly meanCongruentMs: number;
};
export type StroopInterferenceOutput = {
  readonly interferenceMs: number;
};
export const stroopInterferenceInputSchema = {"type":"object","additionalProperties":false,"properties":{"meanIncongruentMs":{"type":"number","minimum":0,"description":"Mean correct-trial incongruent response time."},"meanCongruentMs":{"type":"number","minimum":0,"description":"Mean correct-trial congruent response time."}},"required":["meanIncongruentMs","meanCongruentMs"]} as const satisfies ToolJsonSchema;
export const stroopInterferenceOutputSchema = {"type":"object","additionalProperties":false,"properties":{"interferenceMs":{"type":"number","description":"Incongruent minus congruent mean response time."}},"required":["interferenceMs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateStroopInterference = (input: unknown): ToolResult<StroopInterferenceOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = stroopInterferenceInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, stroopInterferenceInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["meanIncongruentMs","meanCongruentMs"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: StroopInterferenceInput = {
    meanIncongruentMs: values.meanIncongruentMs as number,
    meanCongruentMs: values.meanCongruentMs as number
  };
  const output: StroopInterferenceOutput = { interferenceMs: x.meanIncongruentMs - x.meanCongruentMs };
  if (!matchesToolJsonSchema(output, stroopInterferenceOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const stroopInterferenceTool = defineTool<StroopInterferenceInput, StroopInterferenceOutput>({
  id: "neuroscience/stroop-interference", title: "Stroop Interference", description: "Calculate the signed stroop interference as mean incongruent response time minus mean congruent response time in milliseconds, using caller-prepared comparable correct-trial means.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateStroopInterference,
  inputSchema: stroopInterferenceInputSchema, outputSchema: stroopInterferenceOutputSchema,
  ports: {inputs: [{"id":"meanIncongruentMs","label":"Mean correct-trial incongruent response time","description":"Mean correct-trial incongruent response time.","valueType":{"type":"number","unit":"ms"},"required":true},{"id":"meanCongruentMs","label":"Mean correct-trial congruent response time","description":"Mean correct-trial congruent response time.","valueType":{"type":"number","unit":"ms"},"required":true}], outputs: [{"id":"interferenceMs","label":"Incongruent minus congruent mean response time","description":"Incongruent minus congruent mean response time.","valueType":{"type":"number","unit":"ms"}}]},
});
export const runStroopInterference = stroopInterferenceTool.execute;
export const example = {"input":{"meanIncongruentMs":650,"meanCongruentMs":560},"output":{"interferenceMs":90}} satisfies ToolExample<StroopInterferenceInput, StroopInterferenceOutput>;
export default stroopInterferenceTool;
