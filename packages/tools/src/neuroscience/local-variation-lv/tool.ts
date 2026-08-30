import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://arxiv.org/abs/q-bio/0505024
export type LocalVariationLvInput = {
  readonly intervalsMs: readonly number[];
};
export type LocalVariationLvOutput = {
  readonly localVariation: number;
};
export const localVariationLvInputSchema = {"type":"object","additionalProperties":false,"properties":{"intervalsMs":{"type":"array","items":{"type":"number","exclusiveMinimum":0},"minItems":2,"maxItems":100000,"description":"Positive consecutive interspike intervals."}},"required":["intervalsMs"]} as const satisfies ToolJsonSchema;
export const localVariationLvOutputSchema = {"type":"object","additionalProperties":false,"properties":{"localVariation":{"type":"number","minimum":0,"maximum":3,"description":"Dimensionless local variation."}},"required":["localVariation"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateLocalVariationLv = (input: unknown): ToolResult<LocalVariationLvOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = localVariationLvInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, localVariationLvInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["intervalsMs"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: LocalVariationLvInput = {
    intervalsMs: values.intervalsMs as readonly number[]
  };
  let sum = 0;
  for (let i = 1; i < x.intervalsMs.length; i++) {
    const scale = Math.max(x.intervalsMs[i - 1], x.intervalsMs[i]);
    const a = x.intervalsMs[i - 1] / scale, b = x.intervalsMs[i] / scale;
    sum += ((a - b) / (a + b)) ** 2;
  }
  const output: LocalVariationLvOutput = { localVariation: 3 * (sum / (x.intervalsMs.length - 1)) };
  if (!matchesToolJsonSchema(output, localVariationLvOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const localVariationLvTool = defineTool<LocalVariationLvInput, LocalVariationLvOutput>({
  id: "neuroscience/local-variation-lv", title: "Interspike Local Variation", description: "Calculate Shinomoto local variation Lv = 3/(n−1) × sum(((ISI[i]−ISI[i+1])/(ISI[i]+ISI[i+1]))²) for positive consecutive intervals. This is the original Lv without a refractory-period correction.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateLocalVariationLv,
  inputSchema: localVariationLvInputSchema, outputSchema: localVariationLvOutputSchema,
  ports: {inputs: [{"id":"intervalsMs","label":"Positive consecutive interspike intervals","description":"Positive consecutive interspike intervals.","valueType":{"type":"list","items":{"type":"number"},"unit":"ms"},"required":true}], outputs: [{"id":"localVariation","label":"Dimensionless local variation","description":"Dimensionless local variation.","valueType":{"type":"number"}}]},
});
export const runLocalVariationLv = localVariationLvTool.execute;
export const example = {"input":{"intervalsMs":[10,20,10]},"output":{"localVariation":0.3333333333333333}} satisfies ToolExample<LocalVariationLvInput, LocalVariationLvOutput>;
export default localVariationLvTool;
