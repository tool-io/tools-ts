import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessedLoss: number;
  readonly deductibleAmount: number;
  readonly coveredFraction: number;
};
export type Output = {
  readonly lossAboveDeductible: number;
  readonly paymentBeforeOtherLimits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessedLoss: { type: "number", minimum: 0 },
    deductibleAmount: { type: "number", minimum: 0 },
    coveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["assessedLoss", "deductibleAmount", "coveredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lossAboveDeductible: { type: "number" },
    paymentBeforeOtherLimits: { type: "number" },
  },
  required: ["lossAboveDeductible", "paymentBeforeOtherLimits"],
} as const;
/** Apply an explicit deductible and coinsurance fraction to a supplied assessed loss without determining policy coverage or other limits. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assessedLoss, deductibleAmount, coveredFraction } = request;
  const compute = (): Output => {
    H.domain(assessedLoss >= 0 && deductibleAmount >= 0, "assessedLoss");
    (H.domain(coveredFraction >= 0 && coveredFraction <= 1, "coveredFraction"),
      coveredFraction);
    return {
      lossAboveDeductible: Math.max(0, assessedLoss - deductibleAmount),
      paymentBeforeOtherLimits:
        Math.max(0, assessedLoss - deductibleAmount) * coveredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assessedLoss: 10000, deductibleAmount: 2000, coveredFraction: 0.8 },
  output: { lossAboveDeductible: 8000, paymentBeforeOtherLimits: 6400 },
} satisfies ToolExample<Input, Output>;
export const cropInsuranceDeductibleLossShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/crop-insurance-deductible-loss-share",
    title: "Crop Insurance Deductible Loss Share",
    description:
      "Apply an explicit deductible and coinsurance fraction to a supplied assessed loss without determining policy coverage or other limits.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assessedLoss: { type: "number", minimum: 0 },
        deductibleAmount: { type: "number", minimum: 0 },
        coveredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["assessedLoss", "deductibleAmount", "coveredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lossAboveDeductible: { type: "number" },
        paymentBeforeOtherLimits: { type: "number" },
      },
      required: ["lossAboveDeductible", "paymentBeforeOtherLimits"],
    },
    ports: {
      inputs: [
        {
          id: "assessedLoss",
          label: "Assessed Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deductibleAmount",
          label: "Deductible Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lossAboveDeductible",
          label: "Loss Above Deductible",
          valueType: { type: "number" },
        },
        {
          id: "paymentBeforeOtherLimits",
          label: "Payment Before Other Limits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropInsuranceDeductibleLossShareTool.execute;
export default cropInsuranceDeductibleLossShareTool;
