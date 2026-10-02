import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly total: number;
  readonly firstAmount: number;
  readonly secondAmount: number;
  readonly transfer: number;
};
export type Output = {
  readonly firstFraction: number;
  readonly secondFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    total: { type: "number", exclusiveMinimum: 0 },
    firstAmount: { type: "number", minimum: 0 },
    secondAmount: { type: "number", minimum: 0 },
    transfer: { type: "number" },
  },
  required: ["total", "firstAmount", "secondAmount", "transfer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFraction: { type: "number" },
    secondFraction: { type: "number" },
  },
  required: ["firstFraction", "secondFraction"],
} as const;
/** Calculate weighted share transfer fixed total from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { total, firstAmount, secondAmount, transfer } = request;
  const compute = (): Output => {
    H.positive(total);
    H.domain(
      firstAmount >= 0 &&
        secondAmount >= 0 &&
        firstAmount + secondAmount <= total &&
        firstAmount - transfer >= 0 &&
        secondAmount + transfer >= 0,
    );
    return {
      firstFraction: (firstAmount - transfer) / total,
      secondFraction: (secondAmount + transfer) / total,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { total: 100, firstAmount: 40, secondAmount: 30, transfer: 10 },
  output: { firstFraction: 0.3, secondFraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const weightedShareTransferFixedTotalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/weighted-share-transfer-fixed-total",
    title: "Weighted Share Transfer Fixed Total Tool",
    description:
      "Calculate weighted share transfer fixed total from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        total: { type: "number", exclusiveMinimum: 0 },
        firstAmount: { type: "number", minimum: 0 },
        secondAmount: { type: "number", minimum: 0 },
        transfer: { type: "number" },
      },
      required: ["total", "firstAmount", "secondAmount", "transfer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFraction: { type: "number" },
        secondFraction: { type: "number" },
      },
      required: ["firstFraction", "secondFraction"],
    },
    ports: {
      inputs: [
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstAmount",
          label: "First Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAmount",
          label: "Second Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transfer",
          label: "Transfer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstFraction",
          label: "First Fraction",
          valueType: { type: "number" },
        },
        {
          id: "secondFraction",
          label: "Second Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = weightedShareTransferFixedTotalTool.execute;
export default weightedShareTransferFixedTotalTool;
