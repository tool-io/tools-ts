import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effect: number;
  readonly baseline: number;
  readonly referenceEffect: number;
};
export type Output = { readonly normalizedEffect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effect: { type: "number" },
    baseline: { type: "number" },
    referenceEffect: { type: "number" },
  },
  required: ["effect", "baseline", "referenceEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedEffect: { type: "number" } },
  required: ["normalizedEffect"],
} as const;
/** Normalize a supplied bench effect against explicit baseline/reference values without predicting a clinical response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effect, baseline, referenceEffect } = request;
  const compute = (): Output => {
    H.domain(referenceEffect !== baseline);
    return {
      normalizedEffect: (effect - baseline) / (referenceEffect - baseline),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effect: 12, baseline: 2, referenceEffect: 7 },
  output: { normalizedEffect: 2 },
} satisfies ToolExample<Input, Output>;
export const nonclinicalEffectNormalizationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacodynamics/nonclinical-effect-normalization-factor",
      title: "Nonclinical Effect Normalization Factor Tool",
      description:
        "Normalize a supplied bench effect against explicit baseline/reference values without predicting a clinical response.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effect: { type: "number" },
          baseline: { type: "number" },
          referenceEffect: { type: "number" },
        },
        required: ["effect", "baseline", "referenceEffect"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { normalizedEffect: { type: "number" } },
        required: ["normalizedEffect"],
      },
      ports: {
        inputs: [
          {
            id: "effect",
            label: "Effect",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baseline",
            label: "Baseline",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceEffect",
            label: "Reference Effect",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalizedEffect",
            label: "Normalized Effect",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nonclinicalEffectNormalizationFactorTool.execute;
export default nonclinicalEffectNormalizationFactorTool;
