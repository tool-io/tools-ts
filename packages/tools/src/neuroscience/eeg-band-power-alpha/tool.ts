import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://mne.tools/stable/auto_tutorials/epochs/20_visualize_epochs.html
export type EegBandPowerAlphaInput = {
  readonly frequenciesHz: readonly number[];
  readonly psdUv2PerHz: readonly number[];
  readonly binWidthHz: number;
};
export type EegBandPowerAlphaOutput = {
  readonly powerUv2: number;
};
export const eegBandPowerAlphaInputSchema = {"type":"object","additionalProperties":false,"properties":{"frequenciesHz":{"type":"array","items":{"type":"number","minimum":0},"minItems":1,"maxItems":100000,"description":"Ascending nonnegative frequency bin centers."},"psdUv2PerHz":{"type":"array","items":{"type":"number","minimum":0},"minItems":1,"maxItems":100000,"description":"Nonnegative one-sided EEG power spectral density for each bin."},"binWidthHz":{"type":"number","exclusiveMinimum":0,"description":"Uniform bin spacing and integration width."}},"required":["frequenciesHz","psdUv2PerHz","binWidthHz"]} as const satisfies ToolJsonSchema;
export const eegBandPowerAlphaOutputSchema = {"type":"object","additionalProperties":false,"properties":{"powerUv2":{"type":"number","minimum":0,"description":"Power from supplied bins in the stated band."}},"required":["powerUv2"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);
export const validateSpectrum = (frequencies: readonly number[], psd: readonly number[]): string | null => {
  if (frequencies.length !== psd.length) return "Spectrum arrays must have equal lengths.";
  for (let i = 1; i < frequencies.length; i++)
    if (frequencies[i] <= frequencies[i - 1]) return "Frequency bins must be strictly ascending.";
  return null;
};
export const integrateSpectrumBand = (frequencies: readonly number[], psd: readonly number[], width: number, low: number, high: number): number => {
  let scale = 0;
  for (let i = 0; i < frequencies.length; i++)
    if (frequencies[i] >= low && frequencies[i] < high) scale = Math.max(scale, psd[i]);
  if (scale === 0) return 0;
  let scaledSum = 0;
  for (let i = 0; i < frequencies.length; i++)
    if (frequencies[i] >= low && frequencies[i] < high) scaledSum += psd[i] / scale;
  // Multiply the smallest factors first when the unscaled sum would overflow.
  const factors = [scale, scaledSum, width].sort((a, b) => a - b);
  return factors[0] * factors[1] * factors[2];
};
export const calculateEegBandPowerAlpha = (input: unknown): ToolResult<EegBandPowerAlphaOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = eegBandPowerAlphaInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, eegBandPowerAlphaInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["frequenciesHz","psdUv2PerHz","binWidthHz"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: EegBandPowerAlphaInput = {
    frequenciesHz: values.frequenciesHz as readonly number[],
    psdUv2PerHz: values.psdUv2PerHz as readonly number[],
    binWidthHz: values.binWidthHz as number
  };
  const issue = validateSpectrum(x.frequenciesHz, x.psdUv2PerHz);
  if (issue) return fail("frequenciesHz", issue, "invalid_spectrum");
  for (let i = 1; i < x.frequenciesHz.length; i++) {
    const spacing = x.frequenciesHz[i] - x.frequenciesHz[i - 1];
    const tolerance = 1e-9 * Math.max(spacing, x.binWidthHz) + 8 * Number.EPSILON * Math.max(x.frequenciesHz[i], x.frequenciesHz[i - 1]);
    if (Math.abs(spacing - x.binWidthHz) > tolerance)
      return fail("binWidthHz", "Bin centers must match the declared uniform spacing.", "nonuniform_spectrum");
  }
  const output: EegBandPowerAlphaOutput = { powerUv2: integrateSpectrumBand(x.frequenciesHz, x.psdUv2PerHz, x.binWidthHz, 8, 12) };
  if (!matchesToolJsonSchema(output, eegBandPowerAlphaOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const eegBandPowerAlphaTool = defineTool<EegBandPowerAlphaInput, EegBandPowerAlphaOutput>({
  id: "neuroscience/eeg-band-power-alpha", title: "EEG Alpha Band Power", description: "Integrate supplied uniform PSD bins by sum(PSD × binWidth), selecting centers in [8, 12) Hz under the MNE band convention. The upper endpoint is excluded and unprovided frequencies contribute no power; no FFT or clinical interpretation is performed.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateEegBandPowerAlpha,
  inputSchema: eegBandPowerAlphaInputSchema, outputSchema: eegBandPowerAlphaOutputSchema,
  ports: {inputs: [{"id":"frequenciesHz","label":"Ascending nonnegative frequency bin centers","description":"Ascending nonnegative frequency bin centers.","valueType":{"type":"list","items":{"type":"number"},"unit":"Hz"},"required":true},{"id":"psdUv2PerHz","label":"Nonnegative one-sided EEG power spectral density for each bin","description":"Nonnegative one-sided EEG power spectral density for each bin.","valueType":{"type":"list","items":{"type":"number"},"unit":"uV^2/Hz"},"required":true},{"id":"binWidthHz","label":"Uniform bin spacing and integration width","description":"Uniform bin spacing and integration width.","valueType":{"type":"number","unit":"Hz"},"required":true}], outputs: [{"id":"powerUv2","label":"Power from supplied bins in the stated band","description":"Power from supplied bins in the stated band.","valueType":{"type":"number","unit":"uV^2"}}]},
});
export const runEegBandPowerAlpha = eegBandPowerAlphaTool.execute;
export const example = {"input":{"frequenciesHz":[7,8,9,10,11,12],"psdUv2PerHz":[1,2,3,4,5,6],"binWidthHz":1},"output":{"powerUv2":14}} satisfies ToolExample<EegBandPowerAlphaInput, EegBandPowerAlphaOutput>;
export default eegBandPowerAlphaTool;
