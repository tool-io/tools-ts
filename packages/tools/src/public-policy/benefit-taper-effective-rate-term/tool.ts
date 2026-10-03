import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseBenefit: number;
  readonly incomeOverThreshold: number;
  readonly taperRate: number;
  readonly taxRate: number;
};
export type Output = {
  readonly remainingBenefit: number;
  readonly benefitReduction: number;
  readonly marginalRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseBenefit: { type: "number", minimum: 0 },
    incomeOverThreshold: { type: "number", minimum: 0 },
    taperRate: { type: "number", minimum: 0, maximum: 1 },
    taxRate: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["baseBenefit", "incomeOverThreshold", "taperRate", "taxRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingBenefit: { type: "number" },
    benefitReduction: { type: "number" },
    marginalRate: { type: "number" },
  },
  required: ["remainingBenefit", "benefitReduction", "marginalRate"],
} as const;
/** Linear taper with a zero benefit floor; marginal rate uses the increasing-income right derivative at exhaustion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseBenefit, incomeOverThreshold, taperRate, taxRate } = request;
  const compute = (): Output => {
    H.domain(baseBenefit >= 0 && incomeOverThreshold >= 0);
    H.probability(taperRate);
    H.probability(taxRate);
    return {
      remainingBenefit: Math.max(
        0,
        baseBenefit - incomeOverThreshold * taperRate,
      ),
      benefitReduction: Math.min(baseBenefit, incomeOverThreshold * taperRate),
      marginalRate:
        incomeOverThreshold * taperRate < baseBenefit
          ? taxRate + taperRate
          : taxRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseBenefit: 100,
    incomeOverThreshold: 50,
    taperRate: 0.5,
    taxRate: 0.2,
  },
  output: { remainingBenefit: 75, benefitReduction: 25, marginalRate: 0.7 },
} satisfies ToolExample<Input, Output>;
export const benefitTaperEffectiveRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/benefit-taper-effective-rate-term",
    title: "Benefit Taper Effective Rate Term Tool",
    description:
      "Linear taper with a zero benefit floor; marginal rate uses the increasing-income right derivative at exhaustion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseBenefit: { type: "number", minimum: 0 },
        incomeOverThreshold: { type: "number", minimum: 0 },
        taperRate: { type: "number", minimum: 0, maximum: 1 },
        taxRate: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["baseBenefit", "incomeOverThreshold", "taperRate", "taxRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingBenefit: { type: "number" },
        benefitReduction: { type: "number" },
        marginalRate: { type: "number" },
      },
      required: ["remainingBenefit", "benefitReduction", "marginalRate"],
    },
    ports: {
      inputs: [
        {
          id: "baseBenefit",
          label: "Base Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomeOverThreshold",
          label: "Income Over Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taperRate",
          label: "Taper Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingBenefit",
          label: "Remaining Benefit",
          valueType: { type: "number" },
        },
        {
          id: "benefitReduction",
          label: "Benefit Reduction",
          valueType: { type: "number" },
        },
        {
          id: "marginalRate",
          label: "Marginal Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benefitTaperEffectiveRateTermTool.execute;
export default benefitTaperEffectiveRateTermTool;
