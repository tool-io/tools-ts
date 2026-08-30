import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://pmc.ncbi.nlm.nih.gov/articles/PMC2729552/
export type ErpP300LatencyInput = {
  readonly timesMs: readonly number[];
  readonly amplitudesUv: readonly number[];
  readonly windowStartMs: number;
  readonly windowEndMs: number;
};
export type ErpP300LatencyOutput = {
  readonly latencyMs: number;
  readonly peakAmplitudeUv: number;
};
export const erpP300LatencyInputSchema = {"type":"object","additionalProperties":false,"properties":{"timesMs":{"type":"array","items":{"type":"number"},"minItems":1,"maxItems":100000,"description":"Ascending sample times relative to stimulus onset."},"amplitudesUv":{"type":"array","items":{"type":"number"},"minItems":1,"maxItems":100000,"description":"Baseline-referenced ERP sample amplitudes."},"windowStartMs":{"type":"number","minimum":0,"description":"Inclusive analysis window start."},"windowEndMs":{"type":"number","minimum":0,"description":"Inclusive analysis window end."}},"required":["timesMs","amplitudesUv","windowStartMs","windowEndMs"]} as const satisfies ToolJsonSchema;
export const erpP300LatencyOutputSchema = {"type":"object","additionalProperties":false,"properties":{"latencyMs":{"type":"number","minimum":0,"description":"Time of the maximum positive sample in the window."},"peakAmplitudeUv":{"type":"number","exclusiveMinimum":0,"description":"Amplitude of the selected sample."}},"required":["latencyMs","peakAmplitudeUv"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateErpP300Latency = (input: unknown): ToolResult<ErpP300LatencyOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = erpP300LatencyInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, erpP300LatencyInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["timesMs","amplitudesUv","windowStartMs","windowEndMs"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ErpP300LatencyInput = {
    timesMs: values.timesMs as readonly number[],
    amplitudesUv: values.amplitudesUv as readonly number[],
    windowStartMs: values.windowStartMs as number,
    windowEndMs: values.windowEndMs as number
  };
  if (x.timesMs.length !== x.amplitudesUv.length) return fail("amplitudesUv", "Provide one amplitude per time.", "length_mismatch");
  if (x.windowEndMs < x.windowStartMs) return fail("windowEndMs", "Window end must not precede its start.", "invalid_window");
  let peak = -1;
  for (let i = 0; i < x.timesMs.length; i++) {
    if (i > 0 && x.timesMs[i] <= x.timesMs[i - 1]) return fail("timesMs", "Sample times must be strictly ascending.", "unordered_times");
    if (x.timesMs[i] >= x.windowStartMs && x.timesMs[i] <= x.windowEndMs && x.amplitudesUv[i] > 0 && (peak < 0 || x.amplitudesUv[i] > x.amplitudesUv[peak])) peak = i;
  }
  if (peak < 0) return fail("amplitudesUv", "No positive sample lies in the analysis window.", "missing_positive_peak");
  const output: ErpP300LatencyOutput = { latencyMs: x.timesMs[peak], peakAmplitudeUv: x.amplitudesUv[peak] };
  if (!matchesToolJsonSchema(output, erpP300LatencyOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const erpP300LatencyTool = defineTool<ErpP300LatencyInput, ErpP300LatencyOutput>({
  id: "neuroscience/erp-p300-latency", title: "ERP P300 Peak Latency", description: "Measure sampled positive peak latency in an explicitly supplied inclusive P300 analysis window. Times are relative to stimulus onset, ties select the earliest sample, and at least one positive amplitude is required. Component identification and preprocessing belong to the caller.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateErpP300Latency,
  inputSchema: erpP300LatencyInputSchema, outputSchema: erpP300LatencyOutputSchema,
  ports: {inputs: [{"id":"timesMs","label":"Ascending sample times relative to stimulus onset","description":"Ascending sample times relative to stimulus onset.","valueType":{"type":"list","items":{"type":"number"},"unit":"ms"},"required":true},{"id":"amplitudesUv","label":"Baseline-referenced ERP sample amplitudes","description":"Baseline-referenced ERP sample amplitudes.","valueType":{"type":"list","items":{"type":"number"},"unit":"uV"},"required":true},{"id":"windowStartMs","label":"Inclusive analysis window start","description":"Inclusive analysis window start.","valueType":{"type":"number","unit":"ms"},"required":true},{"id":"windowEndMs","label":"Inclusive analysis window end","description":"Inclusive analysis window end.","valueType":{"type":"number","unit":"ms"},"required":true}], outputs: [{"id":"latencyMs","label":"Time of the maximum positive sample in the window","description":"Time of the maximum positive sample in the window.","valueType":{"type":"number","unit":"ms"}},{"id":"peakAmplitudeUv","label":"Amplitude of the selected sample","description":"Amplitude of the selected sample.","valueType":{"type":"number","unit":"uV"}}]},
});
export const runErpP300Latency = erpP300LatencyTool.execute;
export const example = {"input":{"timesMs":[0,200,300,400,500,700],"amplitudesUv":[0,2,6,5,3,9],"windowStartMs":200,"windowEndMs":600},"output":{"latencyMs":300,"peakAmplitudeUv":6}} satisfies ToolExample<ErpP300LatencyInput, ErpP300LatencyOutput>;
export default erpP300LatencyTool;
