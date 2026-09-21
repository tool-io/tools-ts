import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossPremium: number;
  readonly subsidyFraction: number;
  readonly fixedFee: number;
  readonly feeEligible: boolean;
};
export type Output = {
  readonly subsidy: number;
  readonly producerPayment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPremium: { type: "number", minimum: 0 },
    subsidyFraction: { type: "number", minimum: 0, maximum: 1 },
    fixedFee: { type: "number", minimum: 0 },
    feeEligible: { type: "boolean" },
  },
  required: ["grossPremium", "subsidyFraction", "fixedFee", "feeEligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsidy: { type: "number" },
    producerPayment: { type: "number" },
  },
  required: ["subsidy", "producerPayment"],
} as const;
/** Calculate crop insurance subsidy premium share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossPremium, subsidyFraction, fixedFee, feeEligible } = request;
  const compute = (): Output => {
    H.domain(grossPremium >= 0 && fixedFee >= 0);
    H.probability(subsidyFraction);
    return {
      subsidy: (grossPremium + (feeEligible ? fixedFee : 0)) * subsidyFraction,
      producerPayment:
        grossPremium +
        fixedFee -
        (grossPremium + (feeEligible ? fixedFee : 0)) * subsidyFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossPremium: 100,
    subsidyFraction: 0.5,
    fixedFee: 20,
    feeEligible: false,
  },
  output: { subsidy: 50, producerPayment: 70 },
} satisfies ToolExample<Input, Output>;
export const cropInsuranceSubsidyPremiumShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/crop-insurance-subsidy-premium-share",
    title: "Crop Insurance Subsidy Premium Share Tool",
    description:
      "Calculate crop insurance subsidy premium share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossPremium: { type: "number", minimum: 0 },
        subsidyFraction: { type: "number", minimum: 0, maximum: 1 },
        fixedFee: { type: "number", minimum: 0 },
        feeEligible: { type: "boolean" },
      },
      required: ["grossPremium", "subsidyFraction", "fixedFee", "feeEligible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subsidy: { type: "number" },
        producerPayment: { type: "number" },
      },
      required: ["subsidy", "producerPayment"],
    },
    ports: {
      inputs: [
        {
          id: "grossPremium",
          label: "Gross Premium",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subsidyFraction",
          label: "Subsidy Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feeEligible",
          label: "Fee Eligible",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "subsidy", label: "Subsidy", valueType: { type: "number" } },
        {
          id: "producerPayment",
          label: "Producer Payment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropInsuranceSubsidyPremiumShareTool.execute;
export default cropInsuranceSubsidyPremiumShareTool;
