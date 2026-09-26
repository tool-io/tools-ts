import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialShare: number;
  readonly suppliedCompensatedQuantityChange: number;
  readonly price: number;
  readonly expenditure: number;
};
export type Output = {
  readonly shareContribution: number;
  readonly initialExpenditure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialShare: { type: "number", minimum: 0, maximum: 1 },
    suppliedCompensatedQuantityChange: { type: "number" },
    price: { type: "number" },
    expenditure: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "initialShare",
    "suppliedCompensatedQuantityChange",
    "price",
    "expenditure",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shareContribution: { type: "number" },
    initialExpenditure: { type: "number" },
  },
  required: ["shareContribution", "initialExpenditure"],
} as const;
/** Express a caller-supplied compensated quantity change as a fixed-price expenditure-share contribution; no demand system is estimated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialShare,
    suppliedCompensatedQuantityChange,
    price,
    expenditure,
  } = request;
  const compute = (): Output => {
    H.probability(initialShare);
    H.positive(expenditure);
    return {
      shareContribution:
        (price * suppliedCompensatedQuantityChange) / expenditure,
      initialExpenditure: initialShare * expenditure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialShare: 0.3,
    suppliedCompensatedQuantityChange: -2,
    price: 5,
    expenditure: 100,
  },
  output: { shareContribution: -0.1, initialExpenditure: 30 },
} satisfies ToolExample<Input, Output>;
export const budgetShareCompensatedChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/budget-share-compensated-change",
    title: "Budget Share Compensated Change Tool",
    description:
      "Express a caller-supplied compensated quantity change as a fixed-price expenditure-share contribution; no demand system is estimated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialShare: { type: "number", minimum: 0, maximum: 1 },
        suppliedCompensatedQuantityChange: { type: "number" },
        price: { type: "number" },
        expenditure: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "initialShare",
        "suppliedCompensatedQuantityChange",
        "price",
        "expenditure",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shareContribution: { type: "number" },
        initialExpenditure: { type: "number" },
      },
      required: ["shareContribution", "initialExpenditure"],
    },
    ports: {
      inputs: [
        {
          id: "initialShare",
          label: "Initial Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCompensatedQuantityChange",
          label: "Supplied Compensated Quantity Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expenditure",
          label: "Expenditure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shareContribution",
          label: "Share Contribution",
          valueType: { type: "number" },
        },
        {
          id: "initialExpenditure",
          label: "Initial Expenditure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = budgetShareCompensatedChangeTool.execute;
export default budgetShareCompensatedChangeTool;
