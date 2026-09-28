import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incrementalCost: number;
  readonly incrementalEffect: number;
  readonly threshold: number;
  readonly effectUncertainty: number;
};
export type Output = {
  readonly netBenefitMargin: number;
  readonly lowerEffectNmb: number;
  readonly upperEffectNmb: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalCost: { type: "number" },
    incrementalEffect: { type: "number" },
    threshold: { type: "number", minimum: 0 },
    effectUncertainty: { type: "number", minimum: 0 },
  },
  required: [
    "incrementalCost",
    "incrementalEffect",
    "threshold",
    "effectUncertainty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netBenefitMargin: { type: "number" },
    lowerEffectNmb: { type: "number" },
    upperEffectNmb: { type: "number" },
  },
  required: ["netBenefitMargin", "lowerEffectNmb", "upperEffectNmb"],
} as const;
/** Net-benefit effect-bound sensitivity with cost held fixed; no probabilistic cost-effectiveness interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incrementalCost, incrementalEffect, threshold, effectUncertainty } =
    request;
  const compute = (): Output => {
    H.domain(threshold >= 0 && effectUncertainty >= 0);
    return {
      netBenefitMargin: threshold * incrementalEffect - incrementalCost,
      lowerEffectNmb:
        threshold * (incrementalEffect - effectUncertainty) - incrementalCost,
      upperEffectNmb:
        threshold * (incrementalEffect + effectUncertainty) - incrementalCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    incrementalCost: 1000,
    incrementalEffect: 0.1,
    threshold: 20000,
    effectUncertainty: 0.02,
  },
  output: { netBenefitMargin: 1000, lowerEffectNmb: 600, upperEffectNmb: 1400 },
} satisfies ToolExample<Input, Output>;
export const healthEconomicThresholdNetBenefitMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/health-economic-threshold-net-benefit-margin",
      title: "Health Economic Threshold Net Benefit Margin Tool",
      description:
        "Net-benefit effect-bound sensitivity with cost held fixed; no probabilistic cost-effectiveness interval.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          incrementalCost: { type: "number" },
          incrementalEffect: { type: "number" },
          threshold: { type: "number", minimum: 0 },
          effectUncertainty: { type: "number", minimum: 0 },
        },
        required: [
          "incrementalCost",
          "incrementalEffect",
          "threshold",
          "effectUncertainty",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netBenefitMargin: { type: "number" },
          lowerEffectNmb: { type: "number" },
          upperEffectNmb: { type: "number" },
        },
        required: ["netBenefitMargin", "lowerEffectNmb", "upperEffectNmb"],
      },
      ports: {
        inputs: [
          {
            id: "incrementalCost",
            label: "Incremental Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incrementalEffect",
            label: "Incremental Effect",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "threshold",
            label: "Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "effectUncertainty",
            label: "Effect Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netBenefitMargin",
            label: "Net Benefit Margin",
            valueType: { type: "number" },
          },
          {
            id: "lowerEffectNmb",
            label: "Lower Effect Nmb",
            valueType: { type: "number" },
          },
          {
            id: "upperEffectNmb",
            label: "Upper Effect Nmb",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthEconomicThresholdNetBenefitMarginTool.execute;
export default healthEconomicThresholdNetBenefitMarginTool;
