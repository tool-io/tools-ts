import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bands,
  bounded,
  policyMatrix,
} from "../shared.js";
export type Input = Readonly<{
  readonly adjustedScoreA: number;
  readonly adjustedScoreB: number;
  readonly callerGrandScoreTable: readonly (readonly number[])[];
  readonly callerActionLevelLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly grandScore: number;
  readonly callerActionLevel: number;
  readonly cappedTableRowIndex: number;
  readonly cappedTableColumnIndex: number;
}>;
const inputFields = [
  { id: "adjustedScoreA", label: "Adjusted score a", kind: "number" },
  { id: "adjustedScoreB", label: "Adjusted score b", kind: "number" },
  {
    id: "callerGrandScoreTable",
    label: "Caller grand score table",
    kind: "matrix",
  },
  {
    id: "callerActionLevelLowerEdges",
    label: "Caller action level lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.adjustedScoreA, "A", 1, 13);
  bounded(input.adjustedScoreB, "B", 1, 13);
  policyMatrix(input.callerGrandScoreTable, 8, 7, 1, 7);
  const r = Math.min(input.adjustedScoreA, 8) - 1,
    c = Math.min(input.adjustedScoreB, 7) - 1,
    s = input.callerGrandScoreTable[r][c];
  return {
    grandScore: s,
    callerActionLevel: bands(input.callerActionLevelLowerEdges, s) + 1,
    cappedTableRowIndex: r,
    cappedTableColumnIndex: c,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  adjustedScoreA: 10,
  adjustedScoreB: 8,
  callerGrandScoreTable: [
    [4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4],
  ],
  callerActionLevelLowerEdges: [1, 3, 5, 7],
} satisfies Input;
export const exampleOutput = {
  grandScore: 4,
  callerActionLevel: 2,
  cappedTableRowIndex: 7,
  cappedTableColumnIndex: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/rula-grand-score-mapper",
  title: "RULA Final Grand Score Action Level Mapper",
  description:
    "Map supplied adjusted RULA A/B scores with 8+/7+ indexing into caller grand table and caller action bands; score/action evidence is version-dependent and not a work-safety decision.",
  inputs: inputFields,
  outputs: [
    { id: "grandScore", label: "Grand score", kind: "number" },
    { id: "callerActionLevel", label: "Caller action level", kind: "number" },
    {
      id: "cappedTableRowIndex",
      label: "Capped table row index",
      kind: "number",
    },
    {
      id: "cappedTableColumnIndex",
      label: "Capped table column index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      adjustedScoreA: value.adjustedScoreA as number,
      adjustedScoreB: value.adjustedScoreB as number,
      callerGrandScoreTable:
        value.callerGrandScoreTable as readonly (readonly number[])[],
      callerActionLevelLowerEdges:
        value.callerActionLevelLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
