import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAmount: number;
  readonly secondAmount: number;
  readonly transfer: number;
};
export type Output = {
  readonly firstAfter: number;
  readonly secondAfter: number;
  readonly firstShareChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAmount: { type: "number", minimum: 0 },
    secondAmount: { type: "number", minimum: 0 },
    transfer: { type: "number" },
  },
  required: ["firstAmount", "secondAmount", "transfer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAfter: { type: "number" },
    secondAfter: { type: "number" },
    firstShareChange: { type: "number" },
  },
  required: ["firstAfter", "secondAfter", "firstShareChange"],
} as const;
/** Transfer an explicit amount between two pools while retaining total mass and signed share change. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAmount, secondAmount, transfer } = request;
  const compute = (): Output => {
    H.domain(
      firstAmount >= 0 &&
        secondAmount >= 0 &&
        firstAmount + secondAmount > 0 &&
        transfer <= firstAmount &&
        transfer >= -secondAmount,
    );
    return {
      firstAfter: firstAmount - transfer,
      secondAfter: secondAmount + transfer,
      firstShareChange: -transfer / (firstAmount + secondAmount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAmount: 30, secondAmount: 70, transfer: 10 },
  output: { firstAfter: 20, secondAfter: 80, firstShareChange: -0.1 },
} satisfies ToolExample<Input, Output>;
export const shareTransferDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/share-transfer-difference",
    title: "Share Transfer Difference Tool",
    description:
      "Transfer an explicit amount between two pools while retaining total mass and signed share change.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAmount: { type: "number", minimum: 0 },
        secondAmount: { type: "number", minimum: 0 },
        transfer: { type: "number" },
      },
      required: ["firstAmount", "secondAmount", "transfer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAfter: { type: "number" },
        secondAfter: { type: "number" },
        firstShareChange: { type: "number" },
      },
      required: ["firstAfter", "secondAfter", "firstShareChange"],
    },
    ports: {
      inputs: [
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
          id: "firstAfter",
          label: "First After",
          valueType: { type: "number" },
        },
        {
          id: "secondAfter",
          label: "Second After",
          valueType: { type: "number" },
        },
        {
          id: "firstShareChange",
          label: "First Share Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shareTransferDifferenceTool.execute;
export default shareTransferDifferenceTool;
