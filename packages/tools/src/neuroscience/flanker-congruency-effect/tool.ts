import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0076580
export type FlankerCongruencyEffectInput = {
  readonly meanIncongruentMs: number;
  readonly meanCongruentMs: number;
};
export type FlankerCongruencyEffectOutput = {
  readonly congruencyEffectMs: number;
};
export const flankerCongruencyEffectInputSchema = {"type":"object","additionalProperties":false,"properties":{"meanIncongruentMs":{"type":"number","minimum":0,"description":"Mean correct-trial incongruent response time."},"meanCongruentMs":{"type":"number","minimum":0,"description":"Mean correct-trial congruent response time."}},"required":["meanIncongruentMs","meanCongruentMs"]} as const satisfies ToolJsonSchema;
export const flankerCongruencyEffectOutputSchema = {"type":"object","additionalProperties":false,"properties":{"congruencyEffectMs":{"type":"number","description":"Incongruent minus congruent mean response time."}},"required":["congruencyEffectMs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateFlankerCongruencyEffect = (input: unknown): ToolResult<FlankerCongruencyEffectOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = flankerCongruencyEffectInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, flankerCongruencyEffectInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["meanIncongruentMs","meanCongruentMs"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: FlankerCongruencyEffectInput = {
    meanIncongruentMs: values.meanIncongruentMs as number,
    meanCongruentMs: values.meanCongruentMs as number
  };
  const output: FlankerCongruencyEffectOutput = { congruencyEffectMs: x.meanIncongruentMs - x.meanCongruentMs };
  if (!matchesToolJsonSchema(output, flankerCongruencyEffectOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const flankerCongruencyEffectTool = defineTool<FlankerCongruencyEffectInput, FlankerCongruencyEffectOutput>({
  id: "neuroscience/flanker-congruency-effect", title: "Flanker Congruency Effect", description: "Calculate the signed flanker congruency effect as mean incongruent response time minus mean congruent response time in milliseconds, using caller-prepared comparable correct-trial means.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateFlankerCongruencyEffect,
  inputSchema: flankerCongruencyEffectInputSchema, outputSchema: flankerCongruencyEffectOutputSchema,
  ports: {inputs: [{"id":"meanIncongruentMs","label":"Mean correct-trial incongruent response time","description":"Mean correct-trial incongruent response time.","valueType":{"type":"number","unit":"ms"},"required":true},{"id":"meanCongruentMs","label":"Mean correct-trial congruent response time","description":"Mean correct-trial congruent response time.","valueType":{"type":"number","unit":"ms"},"required":true}], outputs: [{"id":"congruencyEffectMs","label":"Incongruent minus congruent mean response time","description":"Incongruent minus congruent mean response time.","valueType":{"type":"number","unit":"ms"}}]},
});
export const runFlankerCongruencyEffect = flankerCongruencyEffectTool.execute;
export const example = {"input":{"meanIncongruentMs":650,"meanCongruentMs":560},"output":{"congruencyEffectMs":90}} satisfies ToolExample<FlankerCongruencyEffectInput, FlankerCongruencyEffectOutput>;
export default flankerCongruencyEffectTool;
