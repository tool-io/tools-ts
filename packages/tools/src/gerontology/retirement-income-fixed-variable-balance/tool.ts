import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fixedIncome: number;
  readonly variableIncome: number;
  readonly fixedExpense: number;
  readonly variableExpense: number;
  readonly reserveContribution: number;
};
export type Output = {
  readonly totalIncome: number;
  readonly totalExpense: number;
  readonly availableBalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedIncome: { type: "number" },
    variableIncome: { type: "number" },
    fixedExpense: { type: "number", minimum: 0 },
    variableExpense: { type: "number", minimum: 0 },
    reserveContribution: { type: "number", minimum: 0 },
  },
  required: [
    "fixedIncome",
    "variableIncome",
    "fixedExpense",
    "variableExpense",
    "reserveContribution",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalIncome: { type: "number" },
    totalExpense: { type: "number" },
    availableBalance: { type: "number" },
  },
  required: ["totalIncome", "totalExpense", "availableBalance"],
} as const;
/** Calculate retirement income fixed variable balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    fixedIncome,
    variableIncome,
    fixedExpense,
    variableExpense,
    reserveContribution,
  } = request;
  const compute = (): Output => {
    H.domain(
      fixedExpense >= 0 && variableExpense >= 0 && reserveContribution >= 0,
    );
    return {
      totalIncome: fixedIncome + variableIncome,
      totalExpense: fixedExpense + variableExpense,
      availableBalance:
        fixedIncome +
        variableIncome -
        fixedExpense -
        variableExpense -
        reserveContribution,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fixedIncome: 1500,
    variableIncome: 500,
    fixedExpense: 1200,
    variableExpense: 400,
    reserveContribution: 100,
  },
  output: { totalIncome: 2000, totalExpense: 1600, availableBalance: 300 },
} satisfies ToolExample<Input, Output>;
export const retirementIncomeFixedVariableBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/retirement-income-fixed-variable-balance",
      title: "Retirement Income Fixed Variable Balance Tool",
      description:
        "Calculate retirement income fixed variable balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fixedIncome: { type: "number" },
          variableIncome: { type: "number" },
          fixedExpense: { type: "number", minimum: 0 },
          variableExpense: { type: "number", minimum: 0 },
          reserveContribution: { type: "number", minimum: 0 },
        },
        required: [
          "fixedIncome",
          "variableIncome",
          "fixedExpense",
          "variableExpense",
          "reserveContribution",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalIncome: { type: "number" },
          totalExpense: { type: "number" },
          availableBalance: { type: "number" },
        },
        required: ["totalIncome", "totalExpense", "availableBalance"],
      },
      ports: {
        inputs: [
          {
            id: "fixedIncome",
            label: "Fixed Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "variableIncome",
            label: "Variable Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedExpense",
            label: "Fixed Expense",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "variableExpense",
            label: "Variable Expense",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reserveContribution",
            label: "Reserve Contribution",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalIncome",
            label: "Total Income",
            valueType: { type: "number" },
          },
          {
            id: "totalExpense",
            label: "Total Expense",
            valueType: { type: "number" },
          },
          {
            id: "availableBalance",
            label: "Available Balance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = retirementIncomeFixedVariableBalanceTool.execute;
export default retirementIncomeFixedVariableBalanceTool;
