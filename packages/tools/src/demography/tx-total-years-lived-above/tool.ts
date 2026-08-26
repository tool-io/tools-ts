import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TxTotalYearsLivedAboveInput = {
  readonly age?: number;
  readonly personYearsLived: readonly number[];
};

export type TxTotalYearsLivedAboveOutput = {
  readonly totalYearsLived: number;
};

export const calculateTxTotalYearsLivedAbove = (
  input: TxTotalYearsLivedAboveInput,
): TxTotalYearsLivedAboveOutput => {
  const values = input.personYearsLived;
  if (values.length === 0)
    simpleError(
      "personYearsLived",
      "Provide at least one interval person-years value.",
      "invalid_list",
    );
  for (const value of values)
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      simpleError(
        "personYearsLived",
        "Person-years values must be finite and non-negative.",
        "invalid_list",
      );
  let totalYearsLived = 0;
  for (const value of values) totalYearsLived += value;
  return { totalYearsLived };
};

export const txTotalYearsLivedAboveExample = {
  input: { age: 60, personYearsLived: [4.5, 4, 3.5] },
  output: { totalYearsLived: 12 },
} satisfies ToolExample<
  TxTotalYearsLivedAboveInput,
  TxTotalYearsLivedAboveOutput
>;

export const txTotalYearsLivedAboveTool = createSimpleTool({
  id: "demography/tx-total-years-lived-above",
  title: "TX Total Years Lived Above Calculator",
  description:
    "Sum life-table person-years lived Lx over all intervals from a starting age upward to obtain the total years lived above that age.",
  inputs: [
    {
      description: "Starting age x of the summation; used for labeling only.",
      id: "age",
      kind: "number",
      label: "Age",
      minimum: 0,
      required: false,
    },
    {
      description:
        "Person-years lived Lx for each successive interval beginning at age x.",
      id: "personYearsLived",
      kind: "numberList",
      label: "Person-years L",
    },
  ],
  outputs: [
    {
      description: "Total person-years lived Tx above the starting age.",
      id: "totalYearsLived",
      kind: "number",
      label: "Tx",
    },
  ],
  calculate: (input) =>
    calculateTxTotalYearsLivedAbove(
      input as unknown as TxTotalYearsLivedAboveInput,
    ),
});

export const runTxTotalYearsLivedAbove = txTotalYearsLivedAboveTool.execute;
export default txTotalYearsLivedAboveTool;
