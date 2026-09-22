import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBudget: number;
  readonly secondBudget: number;
  readonly transfer: number;
  readonly spentFirst: number;
  readonly spentSecond: number;
};
export type Output = {
  readonly firstRemaining: number;
  readonly secondRemaining: number;
  readonly combinedRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBudget: { type: "number", minimum: 0 },
    secondBudget: { type: "number", minimum: 0 },
    transfer: { type: "number" },
    spentFirst: { type: "number", minimum: 0 },
    spentSecond: { type: "number", minimum: 0 },
  },
  required: [
    "firstBudget",
    "secondBudget",
    "transfer",
    "spentFirst",
    "spentSecond",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRemaining: { type: "number" },
    secondRemaining: { type: "number" },
    combinedRemaining: { type: "number" },
  },
  required: ["firstRemaining", "secondRemaining", "combinedRemaining"],
} as const;
/** Calculate mental account budget transfer residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBudget, secondBudget, transfer, spentFirst, spentSecond } =
    request;
  const compute = (): Output => {
    H.domain(
      firstBudget >= 0 &&
        secondBudget >= 0 &&
        spentFirst >= 0 &&
        spentSecond >= 0 &&
        transfer <= firstBudget &&
        transfer >= -secondBudget,
    );
    return {
      firstRemaining: firstBudget - transfer - spentFirst,
      secondRemaining: secondBudget + transfer - spentSecond,
      combinedRemaining: firstBudget + secondBudget - spentFirst - spentSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstBudget: 100,
    secondBudget: 50,
    transfer: 20,
    spentFirst: 60,
    spentSecond: 40,
  },
  output: { firstRemaining: 20, secondRemaining: 30, combinedRemaining: 50 },
} satisfies ToolExample<Input, Output>;
export const mentalAccountBudgetTransferResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-economics/mental-account-budget-transfer-residual",
      title: "Mental Account Budget Transfer Residual Tool",
      description:
        "Calculate mental account budget transfer residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstBudget: { type: "number", minimum: 0 },
          secondBudget: { type: "number", minimum: 0 },
          transfer: { type: "number" },
          spentFirst: { type: "number", minimum: 0 },
          spentSecond: { type: "number", minimum: 0 },
        },
        required: [
          "firstBudget",
          "secondBudget",
          "transfer",
          "spentFirst",
          "spentSecond",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstRemaining: { type: "number" },
          secondRemaining: { type: "number" },
          combinedRemaining: { type: "number" },
        },
        required: ["firstRemaining", "secondRemaining", "combinedRemaining"],
      },
      ports: {
        inputs: [
          {
            id: "firstBudget",
            label: "First Budget",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondBudget",
            label: "Second Budget",
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
            id: "spentFirst",
            label: "Spent First",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "spentSecond",
            label: "Spent Second",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstRemaining",
            label: "First Remaining",
            valueType: { type: "number" },
          },
          {
            id: "secondRemaining",
            label: "Second Remaining",
            valueType: { type: "number" },
          },
          {
            id: "combinedRemaining",
            label: "Combined Remaining",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mentalAccountBudgetTransferResidualTool.execute;
export default mentalAccountBudgetTransferResidualTool;
