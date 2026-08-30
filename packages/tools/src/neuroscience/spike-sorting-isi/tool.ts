import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://pmc.ncbi.nlm.nih.gov/articles/PMC9666614/
export type SpikeSortingIsiInput = {
  readonly spikeTimesMs: readonly number[];
};
export type SpikeSortingIsiOutput = {
  readonly intervalsMs: readonly number[];
};
export const spikeSortingIsiInputSchema = {"type":"object","additionalProperties":false,"properties":{"spikeTimesMs":{"type":"array","items":{"type":"number"},"minItems":2,"maxItems":100000,"description":"Strictly increasing spike timestamps."}},"required":["spikeTimesMs"]} as const satisfies ToolJsonSchema;
export const spikeSortingIsiOutputSchema = {"type":"object","additionalProperties":false,"properties":{"intervalsMs":{"type":"array","items":{"type":"number","exclusiveMinimum":0},"minItems":1,"maxItems":100000,"description":"Consecutive timestamp differences."}},"required":["intervalsMs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateSpikeSortingIsi = (input: unknown): ToolResult<SpikeSortingIsiOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = spikeSortingIsiInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, spikeSortingIsiInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["spikeTimesMs"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SpikeSortingIsiInput = {
    spikeTimesMs: values.spikeTimesMs as readonly number[]
  };
  const intervalsMs: number[] = [];
  for (let i = 1; i < x.spikeTimesMs.length; i++) {
    if (x.spikeTimesMs[i] <= x.spikeTimesMs[i - 1]) return fail("spikeTimesMs", "Spike timestamps must be strictly increasing.", "unordered_times");
    intervalsMs.push(x.spikeTimesMs[i] - x.spikeTimesMs[i - 1]);
  }
  const output: SpikeSortingIsiOutput = { intervalsMs };
  if (!matchesToolJsonSchema(output, spikeSortingIsiOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const spikeSortingIsiTool = defineTool<SpikeSortingIsiInput, SpikeSortingIsiOutput>({
  id: "neuroscience/spike-sorting-isi", title: "Spike Train Interspike Intervals", description: "Calculate consecutive interspike intervals from strictly increasing timestamps for a single identified spike train. This does not assign spikes to neurons or perform spike sorting.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSpikeSortingIsi,
  inputSchema: spikeSortingIsiInputSchema, outputSchema: spikeSortingIsiOutputSchema,
  ports: {inputs: [{"id":"spikeTimesMs","label":"Strictly increasing spike timestamps","description":"Strictly increasing spike timestamps.","valueType":{"type":"list","items":{"type":"number"},"unit":"ms"},"required":true}], outputs: [{"id":"intervalsMs","label":"Consecutive timestamp differences","description":"Consecutive timestamp differences.","valueType":{"type":"list","items":{"type":"number"},"unit":"ms"}}]},
});
export const runSpikeSortingIsi = spikeSortingIsiTool.execute;
export const example = {"input":{"spikeTimesMs":[5,15,40,55]},"output":{"intervalsMs":[10,25,15]}} satisfies ToolExample<SpikeSortingIsiInput, SpikeSortingIsiOutput>;
export default spikeSortingIsiTool;
