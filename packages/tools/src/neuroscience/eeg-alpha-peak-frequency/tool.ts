import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { validateSpectrum } from "../eeg-band-power-alpha/index.js";
// Method reference: https://mne.tools/stable/auto_tutorials/epochs/20_visualize_epochs.html
export type EegAlphaPeakFrequencyInput = {
  readonly frequenciesHz: readonly number[];
  readonly psdUv2PerHz: readonly number[];
};
export type EegAlphaPeakFrequencyOutput = {
  readonly peakFrequencyHz: number;
  readonly peakPsdUv2PerHz: number;
};
export const eegAlphaPeakFrequencyInputSchema = {"type":"object","additionalProperties":false,"properties":{"frequenciesHz":{"type":"array","items":{"type":"number","minimum":0},"minItems":1,"maxItems":100000,"description":"Ascending nonnegative frequency bin centers."},"psdUv2PerHz":{"type":"array","items":{"type":"number","minimum":0},"minItems":1,"maxItems":100000,"description":"Nonnegative one-sided EEG power spectral density for each bin."}},"required":["frequenciesHz","psdUv2PerHz"]} as const satisfies ToolJsonSchema;
export const eegAlphaPeakFrequencyOutputSchema = {"type":"object","additionalProperties":false,"properties":{"peakFrequencyHz":{"type":"number","minimum":8,"exclusiveMaximum":12,"description":"Frequency of the selected alpha bin."},"peakPsdUv2PerHz":{"type":"number","minimum":0,"description":"PSD of the selected bin."}},"required":["peakFrequencyHz","peakPsdUv2PerHz"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateEegAlphaPeakFrequency = (input: unknown): ToolResult<EegAlphaPeakFrequencyOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = eegAlphaPeakFrequencyInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, eegAlphaPeakFrequencyInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["frequenciesHz","psdUv2PerHz"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: EegAlphaPeakFrequencyInput = {
    frequenciesHz: values.frequenciesHz as readonly number[],
    psdUv2PerHz: values.psdUv2PerHz as readonly number[]
  };
  const issue = validateSpectrum(x.frequenciesHz, x.psdUv2PerHz);
  if (issue) return fail("frequenciesHz", issue, "invalid_spectrum");
  let peak = -1;
  for (let i = 0; i < x.frequenciesHz.length; i++)
    if (x.frequenciesHz[i] >= 8 && x.frequenciesHz[i] < 12 && (peak < 0 || x.psdUv2PerHz[i] > x.psdUv2PerHz[peak])) peak = i;
  if (peak < 0) return fail("frequenciesHz", "Provide at least one bin in [8, 12) Hz.", "missing_alpha_bins");
  const output: EegAlphaPeakFrequencyOutput = { peakFrequencyHz: x.frequenciesHz[peak], peakPsdUv2PerHz: x.psdUv2PerHz[peak] };
  if (!matchesToolJsonSchema(output, eegAlphaPeakFrequencyOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const eegAlphaPeakFrequencyTool = defineTool<EegAlphaPeakFrequencyInput, EegAlphaPeakFrequencyOutput>({
  id: "neuroscience/eeg-alpha-peak-frequency", title: "EEG Alpha Peak Frequency", description: "Find the supplied PSD bin with maximum power in [8, 12) Hz under the MNE alpha convention, choosing the lowest frequency on a tie. The grid need not be uniform; no interpolation or physiological classification is performed.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateEegAlphaPeakFrequency,
  inputSchema: eegAlphaPeakFrequencyInputSchema, outputSchema: eegAlphaPeakFrequencyOutputSchema,
  ports: {inputs: [{"id":"frequenciesHz","label":"Ascending nonnegative frequency bin centers","description":"Ascending nonnegative frequency bin centers.","valueType":{"type":"list","items":{"type":"number"},"unit":"Hz"},"required":true},{"id":"psdUv2PerHz","label":"Nonnegative one-sided EEG power spectral density for each bin","description":"Nonnegative one-sided EEG power spectral density for each bin.","valueType":{"type":"list","items":{"type":"number"},"unit":"uV^2/Hz"},"required":true}], outputs: [{"id":"peakFrequencyHz","label":"Frequency of the selected alpha bin","description":"Frequency of the selected alpha bin.","valueType":{"type":"number","unit":"Hz"}},{"id":"peakPsdUv2PerHz","label":"PSD of the selected bin","description":"PSD of the selected bin.","valueType":{"type":"number","unit":"uV^2/Hz"}}]},
});
export const runEegAlphaPeakFrequency = eegAlphaPeakFrequencyTool.execute;
export const example = {"input":{"frequenciesHz":[7,8,9,10,11,12],"psdUv2PerHz":[20,3,7,5,4,30]},"output":{"peakFrequencyHz":9,"peakPsdUv2PerHz":7}} satisfies ToolExample<EegAlphaPeakFrequencyInput, EegAlphaPeakFrequencyOutput>;
export default eegAlphaPeakFrequencyTool;
