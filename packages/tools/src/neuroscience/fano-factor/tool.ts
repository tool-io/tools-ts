import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://elephant.readthedocs.io/en/latest/reference/_toctree/statistics/elephant.statistics.fanofactor.html
export type FanoFactorInput = {
  readonly spikeCounts: readonly number[];
};
export type FanoFactorOutput = {
  readonly meanCount: number;
  readonly populationVariance: number;
  readonly fanoFactor: number;
};
export const fanoFactorInputSchema = {"type":"object","additionalProperties":false,"properties":{"spikeCounts":{"type":"array","items":{"type":"integer","minimum":0},"minItems":2,"maxItems":100000,"description":"Nonnegative spike counts across equal-duration trials."}},"required":["spikeCounts"]} as const satisfies ToolJsonSchema;
export const fanoFactorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"meanCount":{"type":"number","exclusiveMinimum":0,"description":"Mean trial spike count."},"populationVariance":{"type":"number","minimum":0,"description":"Trial count variance using divisor n."},"fanoFactor":{"type":"number","minimum":0,"description":"Population variance divided by mean."}},"required":["meanCount","populationVariance","fanoFactor"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateFanoFactor = (input: unknown): ToolResult<FanoFactorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = fanoFactorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, fanoFactorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["spikeCounts"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: FanoFactorInput = {
    spikeCounts: values.spikeCounts as readonly number[]
  };
  let meanCount = 0, m2 = 0;
  for (let i = 0; i < x.spikeCounts.length; i++) {
    const delta = x.spikeCounts[i] - meanCount;
    meanCount += delta / (i + 1);
    m2 += delta * (x.spikeCounts[i] - meanCount);
  }
  if (meanCount === 0) return fail("spikeCounts", "Fano factor is undefined when all counts are zero.", "zero_mean");
  const populationVariance = Math.max(0, m2 / x.spikeCounts.length);
  const output: FanoFactorOutput = { meanCount, populationVariance, fanoFactor: populationVariance / meanCount };
  if (!matchesToolJsonSchema(output, fanoFactorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const fanoFactorTool = defineTool<FanoFactorInput, FanoFactorOutput>({
  id: "neuroscience/fano-factor", title: "Spike Count Fano Factor", description: "Calculate the empirical Fano factor as population variance (divisor n) divided by mean spike count across equal-duration repeated trials. The caller supplies counts for one neuron; a zero mean is undefined.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateFanoFactor,
  inputSchema: fanoFactorInputSchema, outputSchema: fanoFactorOutputSchema,
  ports: {inputs: [{"id":"spikeCounts","label":"Nonnegative spike counts across equal-duration trials","description":"Nonnegative spike counts across equal-duration trials.","valueType":{"type":"list","items":{"type":"integer"}},"required":true}], outputs: [{"id":"meanCount","label":"Mean trial spike count","description":"Mean trial spike count.","valueType":{"type":"number"}},{"id":"populationVariance","label":"Trial count variance using divisor n","description":"Trial count variance using divisor n.","valueType":{"type":"number"}},{"id":"fanoFactor","label":"Population variance divided by mean","description":"Population variance divided by mean.","valueType":{"type":"number"}}]},
});
export const runFanoFactor = fanoFactorTool.execute;
export const example = {"input":{"spikeCounts":[0,4]},"output":{"meanCount":2,"populationVariance":4,"fanoFactor":2}} satisfies ToolExample<FanoFactorInput, FanoFactorOutput>;
export default fanoFactorTool;
