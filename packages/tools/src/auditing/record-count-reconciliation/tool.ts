import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sourceRecordCount: number;
  readonly targetRecordCount: number;
  readonly allowedDifference: number;
}>;
export type Output = Readonly<{
  readonly countDifference: number;
  readonly absoluteDifference: number;
  readonly reconciles: boolean;
}>;

export const calculate = (input: Input): Output => {
  const countDifference = input.targetRecordCount - input.sourceRecordCount;
  const absoluteDifference = Math.abs(countDifference);
  return {
    countDifference,
    absoluteDifference,
    reconciles: absoluteDifference <= input.allowedDifference,
  };
};

export const exampleInput = {
  sourceRecordCount: 1000,
  targetRecordCount: 998,
  allowedDifference: 2,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  sourceRecordCount: 1000,
  targetRecordCount: 990,
  allowedDifference: 2,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sourceRecordCount: input.sourceRecordCount as number,
      targetRecordCount: input.targetRecordCount as number,
      allowedDifference: input.allowedDifference as number,
    }),
  description:
    "Reconcile source and target record counts within a caller-supplied tolerance.",
  id: "auditing/record-count-reconciliation",
  inputs: [
    {
      id: "sourceRecordCount",
      label: "Source record count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "targetRecordCount",
      label: "Target record count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "allowedDifference",
      label: "Allowed difference",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "countDifference", label: "Target minus source", kind: "integer" },
    {
      id: "absoluteDifference",
      label: "Absolute difference",
      kind: "integer",
      minimum: 0,
    },
    { id: "reconciles", label: "Reconciles", kind: "boolean" },
  ],
  title: "Record Count Reconciliation",
});

export const run = tool.execute;
export default tool;
