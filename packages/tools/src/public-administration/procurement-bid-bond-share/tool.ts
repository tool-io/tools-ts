import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bidAmount: number; readonly bondAmount: number };
export type Output = {
  readonly bondFraction: number;
  readonly bondPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bidAmount: { type: "number", exclusiveMinimum: 0 },
    bondAmount: { type: "number", minimum: 0 },
  },
  required: ["bidAmount", "bondAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bondFraction: { type: "number" },
    bondPercent: { type: "number" },
  },
  required: ["bondFraction", "bondPercent"],
} as const;
/** Express a recorded bid bond as a share of the bid amount without selecting a procurement requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bidAmount, bondAmount } = request;
  const compute = (): Output => {
    (H.domain(bidAmount > 0, "bidAmount"), bidAmount);
    H.domain(bondAmount >= 0, "bondAmount");
    return {
      bondFraction: bondAmount / bidAmount,
      bondPercent: (100 * bondAmount) / bidAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bidAmount: 100000, bondAmount: 5000 },
  output: { bondFraction: 0.05, bondPercent: 5 },
} satisfies ToolExample<Input, Output>;
export const procurementBidBondShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/procurement-bid-bond-share",
    title: "Procurement Bid Bond Share Tool",
    description:
      "Express a recorded bid bond as a share of the bid amount without selecting a procurement requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bidAmount: { type: "number", exclusiveMinimum: 0 },
        bondAmount: { type: "number", minimum: 0 },
      },
      required: ["bidAmount", "bondAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bondFraction: { type: "number" },
        bondPercent: { type: "number" },
      },
      required: ["bondFraction", "bondPercent"],
    },
    ports: {
      inputs: [
        {
          id: "bidAmount",
          label: "Bid Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bondAmount",
          label: "Bond Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bondFraction",
          label: "Bond Fraction",
          valueType: { type: "number" },
        },
        {
          id: "bondPercent",
          label: "Bond Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = procurementBidBondShareTool.execute;
export default procurementBidBondShareTool;
