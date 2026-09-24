import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emittedBrightness: number;
  readonly redshift: number;
};
export type Output = {
  readonly retainedFraction: number;
  readonly observedBrightness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emittedBrightness: { type: "number", minimum: 0 },
    redshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["emittedBrightness", "redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFraction: { type: "number" },
    observedBrightness: { type: "number" },
  },
  required: ["retainedFraction", "observedBrightness"],
} as const;
/** Bolometric Tolman surface-brightness dimming, excluding bandpass K correction and source evolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emittedBrightness, redshift } = request;
  const compute = (): Output => {
    H.domain(emittedBrightness >= 0 && redshift > -1);
    return {
      retainedFraction: (1 + redshift) ** -4,
      observedBrightness: emittedBrightness / (1 + redshift) ** 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { emittedBrightness: 100, redshift: 1 },
  output: { retainedFraction: 0.0625, observedBrightness: 6.25 },
} satisfies ToolExample<Input, Output>;
export const cosmologicalDimmingSurfaceBrightnessFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/cosmological-dimming-surface-brightness-factor",
      title: "Cosmological Dimming Surface Brightness Factor Tool",
      description:
        "Bolometric Tolman surface-brightness dimming, excluding bandpass K correction and source evolution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          emittedBrightness: { type: "number", minimum: 0 },
          redshift: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["emittedBrightness", "redshift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retainedFraction: { type: "number" },
          observedBrightness: { type: "number" },
        },
        required: ["retainedFraction", "observedBrightness"],
      },
      ports: {
        inputs: [
          {
            id: "emittedBrightness",
            label: "Emitted Brightness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "redshift",
            label: "Redshift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            valueType: { type: "number" },
          },
          {
            id: "observedBrightness",
            label: "Observed Brightness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cosmologicalDimmingSurfaceBrightnessFactorTool.execute;
export default cosmologicalDimmingSurfaceBrightnessFactorTool;
