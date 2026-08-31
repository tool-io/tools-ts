import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, policyMatrix } from "../shared.js";
export type Input = Readonly<{
  readonly neckPostureScore: number;
  readonly trunkPostureScore: number;
  readonly legPostureScore: number;
  readonly muscleUseAdjustment: number;
  readonly forceLoadAdjustment: number;
  readonly callerNeckTrunkLegsTable: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly callerTablePostureScoreB: number;
  readonly adjustedScoreB: number;
  readonly tableRowIndex: number;
  readonly tableColumnIndex: number;
}>;
const inputFields = [
  { id: "neckPostureScore", label: "Neck posture score", kind: "number" },
  { id: "trunkPostureScore", label: "Trunk posture score", kind: "number" },
  { id: "legPostureScore", label: "Leg posture score", kind: "number" },
  { id: "muscleUseAdjustment", label: "Muscle use adjustment", kind: "number" },
  { id: "forceLoadAdjustment", label: "Force load adjustment", kind: "number" },
  {
    id: "callerNeckTrunkLegsTable",
    label: "Caller neck trunk legs table",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const neck = bounded(input.neckPostureScore, "neck", 1, 6),
    trunk = bounded(input.trunkPostureScore, "trunk", 1, 6),
    legs = bounded(input.legPostureScore, "legs", 1, 2),
    m = bounded(input.muscleUseAdjustment, "muscle", 0, 1),
    f = bounded(input.forceLoadAdjustment, "force", 0, 3);
  policyMatrix(input.callerNeckTrunkLegsTable, 6, 12);
  const row = neck - 1,
    col = (trunk - 1) * 2 + legs - 1,
    s = input.callerNeckTrunkLegsTable[row][col];
  return {
    callerTablePostureScoreB: s,
    adjustedScoreB: s + m + f,
    tableRowIndex: row,
    tableColumnIndex: col,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  neckPostureScore: 1,
  trunkPostureScore: 1,
  legPostureScore: 1,
  muscleUseAdjustment: 1,
  forceLoadAdjustment: 2,
  callerNeckTrunkLegsTable: [
    [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  ],
} satisfies Input;
export const exampleOutput = {
  callerTablePostureScoreB: 2,
  adjustedScoreB: 5,
  tableRowIndex: 0,
  tableColumnIndex: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/rula-neck-trunk-legs",
  title: "RULA Neck-Trunk-Legs Score Calculator",
  description:
    "Resolve RULA neck/trunk/legs Group B using caller 6×12 posture table and separate supplied muscle/force adjustments, not the mislabeled wrist-arm Group B alias; does not diagnose risk or validate a protocol edition.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTablePostureScoreB",
      label: "Caller table posture score b",
      kind: "number",
    },
    { id: "adjustedScoreB", label: "Adjusted score b", kind: "number" },
    { id: "tableRowIndex", label: "Table row index", kind: "number" },
    { id: "tableColumnIndex", label: "Table column index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      neckPostureScore: value.neckPostureScore as number,
      trunkPostureScore: value.trunkPostureScore as number,
      legPostureScore: value.legPostureScore as number,
      muscleUseAdjustment: value.muscleUseAdjustment as number,
      forceLoadAdjustment: value.forceLoadAdjustment as number,
      callerNeckTrunkLegsTable:
        value.callerNeckTrunkLegsTable as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
