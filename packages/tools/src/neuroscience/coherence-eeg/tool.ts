import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.coherence.html
export type CoherenceEegInput = {
  readonly autoSpectrumX: number;
  readonly autoSpectrumY: number;
  readonly crossSpectrumReal: number;
  readonly crossSpectrumImaginary: number;
};
export type CoherenceEegOutput = {
  readonly coherence: number;
};
export const coherenceEegInputSchema = {"type":"object","additionalProperties":false,"properties":{"autoSpectrumX":{"type":"number","exclusiveMinimum":0,"description":"Positive auto spectrum of the first signal."},"autoSpectrumY":{"type":"number","exclusiveMinimum":0,"description":"Positive auto spectrum of the second signal."},"crossSpectrumReal":{"type":"number","description":"Real part of the cross spectrum."},"crossSpectrumImaginary":{"type":"number","description":"Imaginary part of the cross spectrum."}},"required":["autoSpectrumX","autoSpectrumY","crossSpectrumReal","crossSpectrumImaginary"]} as const satisfies ToolJsonSchema;
export const coherenceEegOutputSchema = {"type":"object","additionalProperties":false,"properties":{"coherence":{"type":"number","minimum":0,"maximum":1,"description":"Magnitude-squared coherence."}},"required":["coherence"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCoherenceEeg = (input: unknown): ToolResult<CoherenceEegOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = coherenceEegInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, coherenceEegInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["autoSpectrumX","autoSpectrumY","crossSpectrumReal","crossSpectrumImaginary"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CoherenceEegInput = {
    autoSpectrumX: values.autoSpectrumX as number,
    autoSpectrumY: values.autoSpectrumY as number,
    crossSpectrumReal: values.crossSpectrumReal as number,
    crossSpectrumImaginary: values.crossSpectrumImaginary as number
  };
  const small = Math.sqrt(Math.min(x.autoSpectrumX, x.autoSpectrumY));
  const large = Math.sqrt(Math.max(x.autoSpectrumX, x.autoSpectrumY));
  const real = (x.crossSpectrumReal / large) / small;
  const imaginary = (x.crossSpectrumImaginary / large) / small;
  const magnitude = Math.hypot(real, imaginary);
  if (!Number.isFinite(magnitude) || magnitude > 1 + 32 * Number.EPSILON) return fail("crossSpectrumReal", "Cross spectrum exceeds the auto-spectrum coherence bound.", "inconsistent_spectra");
  const output: CoherenceEegOutput = { coherence: Math.min(1, magnitude * magnitude) };
  if (!matchesToolJsonSchema(output, coherenceEegOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const coherenceEegTool = defineTool<CoherenceEegInput, CoherenceEegOutput>({
  id: "neuroscience/coherence-eeg", title: "EEG Magnitude Squared Coherence", description: "Calculate magnitude-squared coherence at one frequency as |Pxy|²/(Pxx × Pyy) from caller-estimated auto and cross spectra. The spectra must use the same units and estimator; no FFT or averaging is performed.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCoherenceEeg,
  inputSchema: coherenceEegInputSchema, outputSchema: coherenceEegOutputSchema,
  ports: {inputs: [{"id":"autoSpectrumX","label":"Positive auto spectrum of the first signal","description":"Positive auto spectrum of the first signal.","valueType":{"type":"number"},"required":true},{"id":"autoSpectrumY","label":"Positive auto spectrum of the second signal","description":"Positive auto spectrum of the second signal.","valueType":{"type":"number"},"required":true},{"id":"crossSpectrumReal","label":"Real part of the cross spectrum","description":"Real part of the cross spectrum.","valueType":{"type":"number"},"required":true},{"id":"crossSpectrumImaginary","label":"Imaginary part of the cross spectrum","description":"Imaginary part of the cross spectrum.","valueType":{"type":"number"},"required":true}], outputs: [{"id":"coherence","label":"Magnitude-squared coherence","description":"Magnitude-squared coherence.","valueType":{"type":"number"}}]},
});
export const runCoherenceEeg = coherenceEegTool.execute;
export const example = {"input":{"autoSpectrumX":4,"autoSpectrumY":9,"crossSpectrumReal":3,"crossSpectrumImaginary":0},"output":{"coherence":0.25}} satisfies ToolExample<CoherenceEegInput, CoherenceEegOutput>;
export default coherenceEegTool;
