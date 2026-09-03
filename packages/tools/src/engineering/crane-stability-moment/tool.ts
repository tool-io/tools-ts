import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerStabilizingLoadsN: readonly number[];
  readonly callerStabilizingArmsM: readonly number[];
  readonly callerOverturningLoadsN: readonly number[];
  readonly callerOverturningArmsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly stabilizingMomentNm: number;
  readonly overturningMomentNm: number;
  readonly signedMomentMarginNm: number;
}>;
const inputFields = [
  {
    id: "callerStabilizingLoadsN",
    label: "Caller stabilizing loads n",
    kind: "numberList",
  },
  {
    id: "callerStabilizingArmsM",
    label: "Caller stabilizing arms m",
    kind: "numberList",
  },
  {
    id: "callerOverturningLoadsN",
    label: "Caller overturning loads n",
    kind: "numberList",
  },
  {
    id: "callerOverturningArmsM",
    label: "Caller overturning arms m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerStabilizingLoadsN.forEach((v) =>
    nonnegative(v, "callerStabilizingLoadsN"),
  );
  input.callerStabilizingArmsM.forEach((v) =>
    nonnegative(v, "callerStabilizingArmsM"),
  );
  input.callerOverturningLoadsN.forEach((v) =>
    nonnegative(v, "callerOverturningLoadsN"),
  );
  input.callerOverturningArmsM.forEach((v) =>
    nonnegative(v, "callerOverturningArmsM"),
  );
  aligned(
    input.callerStabilizingLoadsN,
    input.callerStabilizingArmsM,
    "callerStabilizingLoadsN",
  );
  aligned(
    input.callerOverturningLoadsN,
    input.callerOverturningArmsM,
    "callerOverturningLoadsN",
  );
  const stable = sum(
      input.callerStabilizingLoadsN.map(
        (v, i) => v * input.callerStabilizingArmsM[i],
      ),
    ),
    over = sum(
      input.callerOverturningLoadsN.map(
        (v, i) => v * input.callerOverturningArmsM[i],
      ),
    );
  return {
    stabilizingMomentNm: stable,
    overturningMomentNm: over,
    signedMomentMarginNm: stable - over,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStabilizingLoadsN: [10, 20],
  callerStabilizingArmsM: [2, 1],
  callerOverturningLoadsN: [5, 10],
  callerOverturningArmsM: [1, 3],
} satisfies Input;
export const exampleOutput = {
  stabilizingMomentNm: 40,
  overturningMomentNm: 35,
  signedMomentMarginNm: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/crane-stability-moment",
  title: "Crane Stability Moment Calculator",
  description:
    "Inventory independently resolved crane tipping-axis lever arms and load components, not a supplied two-moment safety ratio or lift clearance. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "stabilizingMomentNm",
      label: "Stabilizing moment nm",
      kind: "number",
    },
    {
      id: "overturningMomentNm",
      label: "Overturning moment nm",
      kind: "number",
    },
    {
      id: "signedMomentMarginNm",
      label: "Signed moment margin nm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerStabilizingLoadsN:
        value.callerStabilizingLoadsN as readonly number[],
      callerStabilizingArmsM: value.callerStabilizingArmsM as readonly number[],
      callerOverturningLoadsN:
        value.callerOverturningLoadsN as readonly number[],
      callerOverturningArmsM: value.callerOverturningArmsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
