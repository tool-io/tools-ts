import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { validateSpectrum, integrateSpectrumBand } from "../eeg-band-power-alpha/index.js";
// Method reference: https://mne.tools/stable/auto_tutorials/epochs/20_visualize_epochs.html
export type EegBandPowerThetaInput = {
  readonly frequenciesHz: readonly number[];
  readonly psdUv2PerHz: readonly number[];
  readonly binWidthHz: number;
};
export type EegBandPowerThetaOutput = {
  readonly powerUv2: number;
};
export const eegBandPowerThetaInputSchema = {"type":"object","additionalProperties":false,"properties":{"frequenciesHz":{"type":"array","items":{"type":"number","minimum":0},"minItems":1,"maxItems":100000,"description":"Ascending nonnegative frequency bin centers."},"psdUv2PerHz":{"type":"array","items":{"type":"number","minimum":0},"minItems":1,"maxItems":100000,"description":"Nonnegative one-sided EEG power spectral density for each bin."},"binWidthHz":{"type":"number","exclusiveMinimum":0,"description":"Uniform bin spacing and integration width."}},"required":["frequenciesHz","psdUv2PerHz","binWidthHz"]} as const satisfies ToolJsonSchema;
export const eegBandPowerThetaOutputSchema = {"type":"object","additionalProperties":false,"properties":{"powerUv2":{"type":"number","minimum":0,"description":"Power from supplied bins in the stated band."}},"required":["powerUv2"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateEegBandPowerTheta = (input: unknown): ToolResult<EegBandPowerThetaOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = eegBandPowerThetaInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, eegBandPowerThetaInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["frequenciesHz","psdUv2PerHz","binWidthHz"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: EegBandPowerThetaInput = {
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
  const output: EegBandPowerThetaOutput = { powerUv2: integrateSpectrumBand(x.frequenciesHz, x.psdUv2PerHz, x.binWidthHz, 4, 8) };
  if (!matchesToolJsonSchema(output, eegBandPowerThetaOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const eegBandPowerThetaTool = defineTool<EegBandPowerThetaInput, EegBandPowerThetaOutput>({
  id: "neuroscience/eeg-band-power-theta", title: "EEG Theta Band Power", description: "Integrate supplied uniform PSD bins by sum(PSD × binWidth), selecting centers in [4, 8) Hz under the MNE band convention. The upper endpoint is excluded and unprovided frequencies contribute no power; no FFT or clinical interpretation is performed.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateEegBandPowerTheta,
  inputSchema: eegBandPowerThetaInputSchema, outputSchema: eegBandPowerThetaOutputSchema,
  ports: {inputs: [{"id":"frequenciesHz","label":"Ascending nonnegative frequency bin centers","description":"Ascending nonnegative frequency bin centers.","valueType":{"type":"list","items":{"type":"number"},"unit":"Hz"},"required":true},{"id":"psdUv2PerHz","label":"Nonnegative one-sided EEG power spectral density for each bin","description":"Nonnegative one-sided EEG power spectral density for each bin.","valueType":{"type":"list","items":{"type":"number"},"unit":"uV^2/Hz"},"required":true},{"id":"binWidthHz","label":"Uniform bin spacing and integration width","description":"Uniform bin spacing and integration width.","valueType":{"type":"number","unit":"Hz"},"required":true}], outputs: [{"id":"powerUv2","label":"Power from supplied bins in the stated band","description":"Power from supplied bins in the stated band.","valueType":{"type":"number","unit":"uV^2"}}]},
});
export const runEegBandPowerTheta = eegBandPowerThetaTool.execute;
export const example = {"input":{"frequenciesHz":[3,4,5,6,7,8],"psdUv2PerHz":[1,2,3,4,5,6],"binWidthHz":1},"output":{"powerUv2":14}} satisfies ToolExample<EegBandPowerThetaInput, EegBandPowerThetaOutput>;
export default eegBandPowerThetaTool;
