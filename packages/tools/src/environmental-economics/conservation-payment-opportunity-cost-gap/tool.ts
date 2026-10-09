import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opportunityCost: number;
  readonly conservationPayment: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunityCost: { type: "number" },
    conservationPayment: { type: "number" },
  },
  required: ["opportunityCost", "conservationPayment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied conservation payment minus opportunity cost in the same valuation basis without judging participation incentives. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opportunityCost, conservationPayment } = request;
  const compute = (): Output => {
    return { signedGap: conservationPayment - opportunityCost };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opportunityCost: 12, conservationPayment: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const conservationPaymentOpportunityCostGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/conservation-payment-opportunity-cost-gap",
      title: "Conservation Payment Opportunity Cost Gap Tool",
      description:
        "Calculate supplied conservation payment minus opportunity cost in the same valuation basis without judging participation incentives.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opportunityCost: { type: "number" },
          conservationPayment: { type: "number" },
        },
        required: ["opportunityCost", "conservationPayment"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "opportunityCost",
            label: "Opportunity Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conservationPayment",
            label: "Conservation Payment",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = conservationPaymentOpportunityCostGapTool.execute;
export default conservationPaymentOpportunityCostGapTool;
