import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minimumQuantity: number;
  readonly taken: number;
  readonly makeupCredits: number;
  readonly unitPrice: number;
};
export type Output = {
  readonly shortfall: number;
  readonly creditedQuantity: number;
  readonly payable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumQuantity: { type: "number", minimum: 0 },
    taken: { type: "number", minimum: 0 },
    makeupCredits: { type: "number", minimum: 0 },
    unitPrice: { type: "number", minimum: 0 },
  },
  required: ["minimumQuantity", "taken", "makeupCredits", "unitPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfall: { type: "number" },
    creditedQuantity: { type: "number" },
    payable: { type: "number" },
  },
  required: ["shortfall", "creditedQuantity", "payable"],
} as const;
/** One supplied contractual makeup-credit arithmetic rule, without interpreting contract terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minimumQuantity, taken, makeupCredits, unitPrice } = request;
  const compute = (): Output => {
    H.domain(
      minimumQuantity >= 0 &&
        taken >= 0 &&
        makeupCredits >= 0 &&
        unitPrice >= 0,
    );
    return {
      shortfall: Math.max(0, minimumQuantity - taken),
      creditedQuantity: Math.min(
        makeupCredits,
        Math.max(0, minimumQuantity - taken),
      ),
      payable: Math.max(0, minimumQuantity - taken - makeupCredits) * unitPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minimumQuantity: 100, taken: 70, makeupCredits: 20, unitPrice: 2 },
  output: { shortfall: 30, creditedQuantity: 20, payable: 20 },
} satisfies ToolExample<Input, Output>;
export const takeOrPayMakeupCreditGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/take-or-pay-makeup-credit-gap",
    title: "Take OR Pay Makeup Credit Gap Tool",
    description:
      "One supplied contractual makeup-credit arithmetic rule, without interpreting contract terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumQuantity: { type: "number", minimum: 0 },
        taken: { type: "number", minimum: 0 },
        makeupCredits: { type: "number", minimum: 0 },
        unitPrice: { type: "number", minimum: 0 },
      },
      required: ["minimumQuantity", "taken", "makeupCredits", "unitPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        creditedQuantity: { type: "number" },
        payable: { type: "number" },
      },
      required: ["shortfall", "creditedQuantity", "payable"],
    },
    ports: {
      inputs: [
        {
          id: "minimumQuantity",
          label: "Minimum Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taken",
          label: "Taken",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "makeupCredits",
          label: "Makeup Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitPrice",
          label: "Unit Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        {
          id: "creditedQuantity",
          label: "Credited Quantity",
          valueType: { type: "number" },
        },
        { id: "payable", label: "Payable", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = takeOrPayMakeupCreditGapTool.execute;
export default takeOrPayMakeupCreditGapTool;
