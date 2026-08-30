import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tableDropRecords: number;
  readonly countRoomTotal: number;
  readonly surveillanceObservedTotal: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly countDifference: number;
  readonly surveillanceDifference: number;
  readonly maximumAbsoluteDifference: number;
  readonly reconciled: boolean;
}>;

export const calculate = (input: Input): Output => {
  const countDifference = input.countRoomTotal - input.tableDropRecords,
    surveillanceDifference =
      input.surveillanceObservedTotal - input.tableDropRecords,
    maximumAbsoluteDifference = Math.max(
      Math.abs(countDifference),
      Math.abs(surveillanceDifference),
    );
  return {
    countDifference,
    surveillanceDifference,
    maximumAbsoluteDifference,
    reconciled: maximumAbsoluteDifference <= input.tolerance,
  };
};

export const exampleInput = {
  tableDropRecords: 10000,
  countRoomTotal: 10005,
  surveillanceObservedTotal: 9998,
  tolerance: 5,
} satisfies Input;
export const exampleOutput = {
  countDifference: 5,
  surveillanceDifference: -2,
  maximumAbsoluteDifference: 5,
  reconciled: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      tableDropRecords: input.tableDropRecords as number,
      countRoomTotal: input.countRoomTotal as number,
      surveillanceObservedTotal: input.surveillanceObservedTotal as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Reconcile casino drop records with count-room and surveillance totals.",
  id: "auditing/casino-drop-reconciliation",
  inputs: [
    {
      id: "tableDropRecords",
      label: "Recorded table drop",
      kind: "number",
      minimum: 0,
    },
    {
      id: "countRoomTotal",
      label: "Count-room total",
      kind: "number",
      minimum: 0,
    },
    {
      id: "surveillanceObservedTotal",
      label: "Surveillance-observed total",
      kind: "number",
      minimum: 0,
    },
    {
      id: "tolerance",
      label: "Allowed difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "countDifference",
      label: "Count-room minus table records",
      kind: "number",
    },
    {
      id: "surveillanceDifference",
      label: "Surveillance minus table records",
      kind: "number",
    },
    {
      id: "maximumAbsoluteDifference",
      label: "Maximum absolute difference",
      kind: "number",
      minimum: 0,
    },
    { id: "reconciled", label: "All totals within tolerance", kind: "boolean" },
  ],
  title: "Casino Drop Reconciliation",
});

export const run = tool.execute;
export default tool;
