import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, scoreTable } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly upperArmDegrees: number;
  readonly lowerArmDegrees: number;
  readonly wristDegrees: number;
  readonly shoulderRaised: boolean;
  readonly armAbducted: boolean;
  readonly armSupported: boolean;
  readonly wristTwisted: boolean;
  readonly callerVerifiedGroupBTable: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly upperArmScore: number;
  readonly lowerArmScore: number;
  readonly wristScore: number;
  readonly callerGroupBScore: number;
}>;
const inputFields = [
  { id: "upperArmDegrees", label: "Upper arm degrees", kind: "number" },
  { id: "lowerArmDegrees", label: "Lower arm degrees", kind: "number" },
  { id: "wristDegrees", label: "Wrist degrees", kind: "number" },
  { id: "shoulderRaised", label: "Shoulder raised", kind: "boolean" },
  { id: "armAbducted", label: "Arm abducted", kind: "boolean" },
  { id: "armSupported", label: "Arm supported", kind: "boolean" },
  { id: "wristTwisted", label: "Wrist twisted", kind: "boolean" },
  {
    id: "callerVerifiedGroupBTable",
    label: "Caller verified group b table",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.upperArmDegrees < -90 ||
    input.upperArmDegrees > 180 ||
    input.lowerArmDegrees < 0 ||
    input.lowerArmDegrees > 180 ||
    Math.abs(input.wristDegrees) > 90
  )
    simpleError("angles", "Observed joint-angle domains.");
  const a = input.upperArmDegrees;
  const upper = Math.max(
    1,
    (a >= -20 && a <= 20 ? 1 : a < -20 || a <= 45 ? 2 : a <= 90 ? 3 : 4) +
      (input.shoulderRaised ? 1 : 0) +
      (input.armAbducted ? 1 : 0) -
      (input.armSupported ? 1 : 0),
  );
  const lower =
      input.lowerArmDegrees >= 60 && input.lowerArmDegrees <= 100 ? 1 : 2,
    wrist =
      (Math.abs(input.wristDegrees) <= 15 ? 1 : 2) +
      (input.wristTwisted ? 1 : 0);
  return {
    upperArmScore: upper,
    lowerArmScore: lower,
    wristScore: wrist,
    callerGroupBScore: scoreTable(
      [(lower - 1) * 6 + upper, wrist],
      input.callerVerifiedGroupBTable,
      [12, 3],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upperArmDegrees: 50,
  lowerArmDegrees: 80,
  wristDegrees: 20,
  shoulderRaised: true,
  armAbducted: false,
  armSupported: false,
  wristTwisted: true,
  callerVerifiedGroupBTable: [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
    [5, 6, 7],
    [6, 7, 8],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
    [5, 6, 7],
    [6, 7, 8],
    [7, 8, 9],
  ],
} satisfies Input;
export const exampleOutput = {
  upperArmScore: 4,
  lowerArmScore: 1,
  wristScore: 3,
  callerGroupBScore: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/reba-arm-wrist-score",
  title: "REBA Arm-Wrist Score Calculator",
  description:
    "REBA arm/wrist measured component scores and caller independently verified12×3edition GroupBtable (lower-arm then upper-arm rows); muscle/load/grand score separate. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "upperArmScore", label: "Upper arm score", kind: "number" },
    { id: "lowerArmScore", label: "Lower arm score", kind: "number" },
    { id: "wristScore", label: "Wrist score", kind: "number" },
    { id: "callerGroupBScore", label: "Caller group b score", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      upperArmDegrees: value.upperArmDegrees as number,
      lowerArmDegrees: value.lowerArmDegrees as number,
      wristDegrees: value.wristDegrees as number,
      shoulderRaised: value.shoulderRaised as boolean,
      armAbducted: value.armAbducted as boolean,
      armSupported: value.armSupported as boolean,
      wristTwisted: value.wristTwisted as boolean,
      callerVerifiedGroupBTable:
        value.callerVerifiedGroupBTable as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
