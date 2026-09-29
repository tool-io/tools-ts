import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly desiredNet: number;
  readonly withholdingFraction: number;
  readonly processingFee: number;
};
export type Output = {
  readonly grossPayment: number;
  readonly withheld: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    desiredNet: { type: "number", minimum: 0 },
    withholdingFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    processingFee: { type: "number", minimum: 0 },
  },
  required: ["desiredNet", "withholdingFraction", "processingFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPayment: { type: "number" },
    withheld: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["grossPayment", "withheld", "totalCost"],
} as const;
/** Explicit withholding gross-up only, without a treaty, jurisdiction or tax-liability determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { desiredNet, withholdingFraction, processingFee } = request;
  const compute = (): Output => {
    H.domain(
      desiredNet >= 0 &&
        withholdingFraction >= 0 &&
        withholdingFraction < 1 &&
        processingFee >= 0,
    );
    return {
      grossPayment: desiredNet / (1 - withholdingFraction),
      withheld: (desiredNet * withholdingFraction) / (1 - withholdingFraction),
      totalCost: desiredNet / (1 - withholdingFraction) + processingFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { desiredNet: 900, withholdingFraction: 0.1, processingFee: 20 },
  output: { grossPayment: 1000, withheld: 100, totalCost: 1020 },
} satisfies ToolExample<Input, Output>;
export const crossBorderSubscriptionWithholdingGrossupTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/cross-border-subscription-withholding-grossup-term",
      title: "Cross Border Subscription Withholding Grossup Term Tool",
      description:
        "Explicit withholding gross-up only, without a treaty, jurisdiction or tax-liability determination.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          desiredNet: { type: "number", minimum: 0 },
          withholdingFraction: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1,
          },
          processingFee: { type: "number", minimum: 0 },
        },
        required: ["desiredNet", "withholdingFraction", "processingFee"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossPayment: { type: "number" },
          withheld: { type: "number" },
          totalCost: { type: "number" },
        },
        required: ["grossPayment", "withheld", "totalCost"],
      },
      ports: {
        inputs: [
          {
            id: "desiredNet",
            label: "Desired Net",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "withholdingFraction",
            label: "Withholding Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "processingFee",
            label: "Processing Fee",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossPayment",
            label: "Gross Payment",
            valueType: { type: "number" },
          },
          { id: "withheld", label: "Withheld", valueType: { type: "number" } },
          {
            id: "totalCost",
            label: "Total Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = crossBorderSubscriptionWithholdingGrossupTermTool.execute;
export default crossBorderSubscriptionWithholdingGrossupTermTool;
