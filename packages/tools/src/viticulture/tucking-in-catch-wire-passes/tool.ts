import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
  shape,
  unique,
  matrixFlags,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly rowIds: readonly string[];
  readonly observedCompletedTuckPassFlags: readonly (readonly number[])[];
  readonly callerRequiredPassCountsByRow: readonly number[];
}>;
export type Output = Readonly<{
  readonly completedTuckPassCountsByRow: readonly number[];
  readonly rowsBelowCallerPassPlan: readonly string[];
  readonly totalObservedRowPasses: number;
}>;
const inputFields = [
  { id: "rowIds", label: "Row ids", kind: "stringList" },
  {
    id: "observedCompletedTuckPassFlags",
    label: "Observed completed tuck pass flags",
    kind: "matrix",
  },
  {
    id: "callerRequiredPassCountsByRow",
    label: "Caller required pass counts by row",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.rowIds, "rows");
  const width = shape(input.observedCompletedTuckPassFlags, "passes");
  matrixFlags(input.observedCompletedTuckPassFlags, width);
  aligned(input.rowIds, input.observedCompletedTuckPassFlags, "rows");
  aligned(input.rowIds, input.callerRequiredPassCountsByRow, "rows");
  input.callerRequiredPassCountsByRow.forEach((v) =>
    bounded(v, "required", 0, 128),
  );
  const counts = input.observedCompletedTuckPassFlags.map(sum);
  return {
    completedTuckPassCountsByRow: counts,
    rowsBelowCallerPassPlan: input.rowIds.filter(
      (_, i) => counts[i] < input.callerRequiredPassCountsByRow[i],
    ),
    totalObservedRowPasses: sum(counts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rowIds: ["a", "b"],
  observedCompletedTuckPassFlags: [
    [1, 1, 0],
    [1, 0, 0],
  ],
  callerRequiredPassCountsByRow: [2, 2],
} satisfies Input;
export const exampleOutput = {
  completedTuckPassCountsByRow: [2, 1],
  rowsBelowCallerPassPlan: ["b"],
  totalObservedRowPasses: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/tucking-in-catch-wire-passes",
  title: "Tucking In Catch Wire Passes Counter",
  description:
    "Audit actual row-by-pass tucking completion under caller required counts; not total row count, physical catch-wire geometry or guarantee shoots are retained.",
  inputs: inputFields,
  outputs: [
    {
      id: "completedTuckPassCountsByRow",
      label: "Completed tuck pass counts by row",
      kind: "numberList",
    },
    {
      id: "rowsBelowCallerPassPlan",
      label: "Rows below caller pass plan",
      kind: "stringList",
    },
    {
      id: "totalObservedRowPasses",
      label: "Total observed row passes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rowIds: value.rowIds as readonly string[],
      observedCompletedTuckPassFlags:
        value.observedCompletedTuckPassFlags as readonly (readonly number[])[],
      callerRequiredPassCountsByRow:
        value.callerRequiredPassCountsByRow as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
