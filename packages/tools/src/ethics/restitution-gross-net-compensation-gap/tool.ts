import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loss: number;
  readonly grossCompensation: number;
  readonly transactionExpense: number;
  readonly priorRecovery: number;
};
export type Output = {
  readonly netCompensation: number;
  readonly remainingLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loss: { type: "number", minimum: 0 },
    grossCompensation: { type: "number", minimum: 0 },
    transactionExpense: { type: "number", minimum: 0 },
    priorRecovery: { type: "number", minimum: 0 },
  },
  required: [
    "loss",
    "grossCompensation",
    "transactionExpense",
    "priorRecovery",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCompensation: { type: "number" },
    remainingLoss: { type: "number" },
  },
  required: ["netCompensation", "remainingLoss"],
} as const;
/** Signed restitution accounting without selecting a legal measure of damages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loss, grossCompensation, transactionExpense, priorRecovery } =
    request;
  const compute = (): Output => {
    H.domain(
      loss >= 0 &&
        grossCompensation >= 0 &&
        transactionExpense >= 0 &&
        priorRecovery >= 0,
    );
    return {
      netCompensation: grossCompensation - transactionExpense + priorRecovery,
      remainingLoss:
        loss - grossCompensation + transactionExpense - priorRecovery,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    loss: 100,
    grossCompensation: 80,
    transactionExpense: 10,
    priorRecovery: 20,
  },
  output: { netCompensation: 90, remainingLoss: 10 },
} satisfies ToolExample<Input, Output>;
export const restitutionGrossNetCompensationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/restitution-gross-net-compensation-gap",
    title: "Restitution Gross Net Compensation Gap Tool",
    description:
      "Signed restitution accounting without selecting a legal measure of damages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loss: { type: "number", minimum: 0 },
        grossCompensation: { type: "number", minimum: 0 },
        transactionExpense: { type: "number", minimum: 0 },
        priorRecovery: { type: "number", minimum: 0 },
      },
      required: [
        "loss",
        "grossCompensation",
        "transactionExpense",
        "priorRecovery",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netCompensation: { type: "number" },
        remainingLoss: { type: "number" },
      },
      required: ["netCompensation", "remainingLoss"],
    },
    ports: {
      inputs: [
        {
          id: "loss",
          label: "Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossCompensation",
          label: "Gross Compensation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transactionExpense",
          label: "Transaction Expense",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorRecovery",
          label: "Prior Recovery",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netCompensation",
          label: "Net Compensation",
          valueType: { type: "number" },
        },
        {
          id: "remainingLoss",
          label: "Remaining Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = restitutionGrossNetCompensationGapTool.execute;
export default restitutionGrossNetCompensationGapTool;
