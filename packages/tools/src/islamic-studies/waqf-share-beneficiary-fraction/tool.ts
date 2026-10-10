import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distributableAmount: number;
  readonly suppliedShareFraction: number;
};
export type Output = {
  readonly allocatedAmount: number;
  readonly remainingAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distributableAmount: { type: "number", minimum: 0 },
    suppliedShareFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["distributableAmount", "suppliedShareFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedAmount: { type: "number" },
    remainingAmount: { type: "number" },
  },
  required: ["allocatedAmount", "remainingAmount"],
} as const;
/** Apply an explicitly supplied beneficiary fraction to a stated distributable amount without interpreting waqf terms or legal entitlements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distributableAmount, suppliedShareFraction } = request;
  const compute = (): Output => {
    H.domain(distributableAmount >= 0, "distributableAmount");
    (H.domain(
      suppliedShareFraction >= 0 && suppliedShareFraction <= 1,
      "suppliedShareFraction",
    ),
      suppliedShareFraction);
    return {
      allocatedAmount: distributableAmount * suppliedShareFraction,
      remainingAmount: distributableAmount * (1 - suppliedShareFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distributableAmount: 1000, suppliedShareFraction: 0.25 },
  output: { allocatedAmount: 250, remainingAmount: 750 },
} satisfies ToolExample<Input, Output>;
export const waqfShareBeneficiaryFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/waqf-share-beneficiary-fraction",
    title: "Waqf Share Beneficiary Fraction",
    description:
      "Apply an explicitly supplied beneficiary fraction to a stated distributable amount without interpreting waqf terms or legal entitlements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distributableAmount: { type: "number", minimum: 0 },
        suppliedShareFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["distributableAmount", "suppliedShareFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedAmount: { type: "number" },
        remainingAmount: { type: "number" },
      },
      required: ["allocatedAmount", "remainingAmount"],
    },
    ports: {
      inputs: [
        {
          id: "distributableAmount",
          label: "Distributable Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedShareFraction",
          label: "Supplied Share Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedAmount",
          label: "Allocated Amount",
          valueType: { type: "number" },
        },
        {
          id: "remainingAmount",
          label: "Remaining Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waqfShareBeneficiaryFractionTool.execute;
export default waqfShareBeneficiaryFractionTool;
