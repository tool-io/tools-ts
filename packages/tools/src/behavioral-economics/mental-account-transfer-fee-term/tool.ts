import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceBalance: number;
  readonly targetBalance: number;
  readonly transfer: number;
  readonly fee: number;
  readonly feeFromSource: boolean;
};
export type Output = {
  readonly sourceAfter: number;
  readonly targetAfter: number;
  readonly totalLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceBalance: { type: "number", minimum: 0 },
    targetBalance: { type: "number", minimum: 0 },
    transfer: { type: "number", minimum: 0 },
    fee: { type: "number", minimum: 0 },
    feeFromSource: { type: "boolean" },
  },
  required: [
    "sourceBalance",
    "targetBalance",
    "transfer",
    "fee",
    "feeFromSource",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceAfter: { type: "number" },
    targetAfter: { type: "number" },
    totalLoss: { type: "number" },
  },
  required: ["sourceAfter", "targetAfter", "totalLoss"],
} as const;
/** Calculate mental account transfer fee term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceBalance, targetBalance, transfer, fee, feeFromSource } =
    request;
  const compute = (): Output => {
    H.domain(
      sourceBalance >= 0 &&
        targetBalance >= 0 &&
        transfer >= 0 &&
        fee >= 0 &&
        sourceBalance >= transfer + (feeFromSource ? fee : 0) &&
        targetBalance + transfer >= (feeFromSource ? 0 : fee),
    );
    return {
      sourceAfter: sourceBalance - transfer - (feeFromSource ? fee : 0),
      targetAfter: targetBalance + transfer - (feeFromSource ? 0 : fee),
      totalLoss: fee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceBalance: 100,
    targetBalance: 20,
    transfer: 30,
    fee: 2,
    feeFromSource: true,
  },
  output: { sourceAfter: 68, targetAfter: 50, totalLoss: 2 },
} satisfies ToolExample<Input, Output>;
export const mentalAccountTransferFeeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/mental-account-transfer-fee-term",
    title: "Mental Account Transfer Fee Term Tool",
    description:
      "Calculate mental account transfer fee term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceBalance: { type: "number", minimum: 0 },
        targetBalance: { type: "number", minimum: 0 },
        transfer: { type: "number", minimum: 0 },
        fee: { type: "number", minimum: 0 },
        feeFromSource: { type: "boolean" },
      },
      required: [
        "sourceBalance",
        "targetBalance",
        "transfer",
        "fee",
        "feeFromSource",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceAfter: { type: "number" },
        targetAfter: { type: "number" },
        totalLoss: { type: "number" },
      },
      required: ["sourceAfter", "targetAfter", "totalLoss"],
    },
    ports: {
      inputs: [
        {
          id: "sourceBalance",
          label: "Source Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBalance",
          label: "Target Balance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transfer",
          label: "Transfer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fee",
          label: "Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feeFromSource",
          label: "Fee From Source",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sourceAfter",
          label: "Source After",
          valueType: { type: "number" },
        },
        {
          id: "targetAfter",
          label: "Target After",
          valueType: { type: "number" },
        },
        { id: "totalLoss", label: "Total Loss", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mentalAccountTransferFeeTermTool.execute;
export default mentalAccountTransferFeeTermTool;
