import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, policyMatrix } from "../shared.js";
export type Input = Readonly<{
  readonly upperArmPostureScore: number;
  readonly lowerArmPostureScore: number;
  readonly wristPostureScore: number;
  readonly wristTwistScore: number;
  readonly muscleUseAdjustment: number;
  readonly forceLoadAdjustment: number;
  readonly callerGroupATable: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly callerTablePostureScoreA: number;
  readonly adjustedScoreA: number;
  readonly tableRowIndex: number;
  readonly tableColumnIndex: number;
}>;
const inputFields = [
  {
    id: "upperArmPostureScore",
    label: "Upper arm posture score",
    kind: "number",
  },
  {
    id: "lowerArmPostureScore",
    label: "Lower arm posture score",
    kind: "number",
  },
  { id: "wristPostureScore", label: "Wrist posture score", kind: "number" },
  { id: "wristTwistScore", label: "Wrist twist score", kind: "number" },
  { id: "muscleUseAdjustment", label: "Muscle use adjustment", kind: "number" },
  { id: "forceLoadAdjustment", label: "Force load adjustment", kind: "number" },
  { id: "callerGroupATable", label: "Caller group a table", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const u = bounded(input.upperArmPostureScore, "upperArm", 1, 6),
    l = bounded(input.lowerArmPostureScore, "lowerArm", 1, 3),
    w = bounded(input.wristPostureScore, "wrist", 1, 4),
    t = bounded(input.wristTwistScore, "twist", 1, 2),
    m = bounded(input.muscleUseAdjustment, "muscle", 0, 1),
    f = bounded(input.forceLoadAdjustment, "force", 0, 3);
  policyMatrix(input.callerGroupATable, 18, 8);
  const row = (u - 1) * 3 + l - 1,
    col = (w - 1) * 2 + t - 1,
    s = input.callerGroupATable[row][col];
  return {
    callerTablePostureScoreA: s,
    adjustedScoreA: s + m + f,
    tableRowIndex: row,
    tableColumnIndex: col,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upperArmPostureScore: 1,
  lowerArmPostureScore: 1,
  wristPostureScore: 1,
  wristTwistScore: 1,
  muscleUseAdjustment: 1,
  forceLoadAdjustment: 2,
  callerGroupATable: [
    [2, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3],
  ],
} satisfies Input;
export const exampleOutput = {
  callerTablePostureScoreA: 2,
  adjustedScoreA: 5,
  tableRowIndex: 0,
  tableColumnIndex: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/rula-group-a-score",
  title: "RULA Upper Limb Group A Score Calculator",
  description:
    "Resolve RULA upper-arm/lower-arm/wrist/twist posture indexing against caller 18×8 versioned Group A table, then supplied muscle/force adjustments; caller scores/evidence and table are not independently verified or safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerTablePostureScoreA",
      label: "Caller table posture score a",
      kind: "number",
    },
    { id: "adjustedScoreA", label: "Adjusted score a", kind: "number" },
    { id: "tableRowIndex", label: "Table row index", kind: "number" },
    { id: "tableColumnIndex", label: "Table column index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      upperArmPostureScore: value.upperArmPostureScore as number,
      lowerArmPostureScore: value.lowerArmPostureScore as number,
      wristPostureScore: value.wristPostureScore as number,
      wristTwistScore: value.wristTwistScore as number,
      muscleUseAdjustment: value.muscleUseAdjustment as number,
      forceLoadAdjustment: value.forceLoadAdjustment as number,
      callerGroupATable:
        value.callerGroupATable as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
