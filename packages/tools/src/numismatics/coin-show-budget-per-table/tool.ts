import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoinShowBudgetPerTableInput = Readonly<{
  readonly totalShowBudget: number;
  readonly tableCount: number;
}>;
export type CoinShowBudgetPerTableOutput = Readonly<{
  readonly budgetPerTable: number;
}>;

export const calculateCoinShowBudgetPerTable = (
  x: CoinShowBudgetPerTableInput,
): CoinShowBudgetPerTableOutput => {
  if (!Number.isFinite(x.totalShowBudget) || x.totalShowBudget < 0)
    simpleError("totalShowBudget", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.tableCount) ||
    x.tableCount <= 0 ||
    !Number.isSafeInteger(x.tableCount)
  )
    simpleError("tableCount", "Provide a positive whole number.");
  const budgetPerTable = x.totalShowBudget / x.tableCount;
  if (!Number.isFinite(budgetPerTable))
    simpleError(
      "budgetPerTable",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { budgetPerTable: Object.is(budgetPerTable, -0) ? 0 : budgetPerTable };
};

export const example = {
  input: {
    totalShowBudget: 1000,
    tableCount: 10,
  },
  output: { budgetPerTable: 100 },
} satisfies ToolExample<
  CoinShowBudgetPerTableInput,
  CoinShowBudgetPerTableOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/coin-show-budget-per-table",
  title: "Coin Show Budget Per Table",
  description:
    "Allocate a fixed coin-show spending budget evenly across planned tables.",
  inputs: [
    {
      id: "totalShowBudget",
      kind: "number",
      label: "Total Show Budget",
      unit: "currency",
    },
    { id: "tableCount", kind: "number", label: "Table Count", unit: "tables" },
  ],
  outputs: [
    {
      id: "budgetPerTable",
      kind: "number",
      label: "Budget Per Table",
      unit: "currency/table",
    },
  ],
  calculate: (input) =>
    calculateCoinShowBudgetPerTable({
      totalShowBudget: input.totalShowBudget as number,
      tableCount: input.tableCount as number,
    }),
});
export const runCoinShowBudgetPerTable = tool.execute;
export default tool;
