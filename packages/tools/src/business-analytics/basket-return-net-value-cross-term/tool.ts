import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossValue: number;
  readonly returnShare: number;
  readonly discountShare: number;
  readonly fixedReturnFee: number;
};
export type Output = {
  readonly netValue: number;
  readonly returnDiscountInteraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossValue: { type: "number", minimum: 0 },
    returnShare: { type: "number", minimum: 0, maximum: 1 },
    discountShare: { type: "number", minimum: 0, maximum: 1 },
    fixedReturnFee: { type: "number", minimum: 0 },
  },
  required: ["grossValue", "returnShare", "discountShare", "fixedReturnFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netValue: { type: "number" },
    returnDiscountInteraction: { type: "number" },
  },
  required: ["netValue", "returnDiscountInteraction"],
} as const;
/** Calculate basket return net value cross term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossValue, returnShare, discountShare, fixedReturnFee } = request;
  const compute = (): Output => {
    H.domain(grossValue >= 0 && fixedReturnFee >= 0);
    H.probability(returnShare);
    H.probability(discountShare);
    return {
      netValue:
        grossValue * (1 - returnShare) * (1 - discountShare) - fixedReturnFee,
      returnDiscountInteraction: grossValue * returnShare * discountShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossValue: 100,
    returnShare: 0.2,
    discountShare: 0.1,
    fixedReturnFee: 5,
  },
  output: { netValue: 67, returnDiscountInteraction: 2 },
} satisfies ToolExample<Input, Output>;
export const basketReturnNetValueCrossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/basket-return-net-value-cross-term",
    title: "Basket Return Net Value Cross Term Tool",
    description:
      "Calculate basket return net value cross term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossValue: { type: "number", minimum: 0 },
        returnShare: { type: "number", minimum: 0, maximum: 1 },
        discountShare: { type: "number", minimum: 0, maximum: 1 },
        fixedReturnFee: { type: "number", minimum: 0 },
      },
      required: [
        "grossValue",
        "returnShare",
        "discountShare",
        "fixedReturnFee",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netValue: { type: "number" },
        returnDiscountInteraction: { type: "number" },
      },
      required: ["netValue", "returnDiscountInteraction"],
    },
    ports: {
      inputs: [
        {
          id: "grossValue",
          label: "Gross Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnShare",
          label: "Return Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "discountShare",
          label: "Discount Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "fixedReturnFee",
          label: "Fixed Return Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netValue", label: "Net Value", valueType: { type: "number" } },
        {
          id: "returnDiscountInteraction",
          label: "Return Discount Interaction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = basketReturnNetValueCrossTermTool.execute;
export default basketReturnNetValueCrossTermTool;
