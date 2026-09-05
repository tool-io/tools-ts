import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  secants,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRoadStationM: readonly number[];
  readonly observedRoadLevelsM: readonly number[];
  readonly callerMaximumAbsoluteGradeFraction: number;
}>;
export type Output = Readonly<{
  readonly signedObservedRoadGrades: readonly number[];
  readonly roadGradeReviewSegments: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRoadStationM",
    label: "Observed road station m",
    kind: "numberList",
  },
  {
    id: "observedRoadLevelsM",
    label: "Observed road levels m",
    kind: "numberList",
  },
  {
    id: "callerMaximumAbsoluteGradeFraction",
    label: "Caller maximum absolute grade fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMaximumAbsoluteGradeFraction,
    "callerMaximumAbsoluteGradeFraction",
  );
  const grade = secants(input.observedRoadStationM, input.observedRoadLevelsM);
  return {
    signedObservedRoadGrades: grade,
    roadGradeReviewSegments: grade.flatMap((v, i) =>
      Math.abs(v) > input.callerMaximumAbsoluteGradeFraction ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoadStationM: [0, 10, 30],
  observedRoadLevelsM: [0, 1, 0],
  callerMaximumAbsoluteGradeFraction: 0.08,
} satisfies Input;
export const exampleOutput = {
  signedObservedRoadGrades: [0.1, -0.05],
  roadGradeReviewSegments: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/haul-road-grade",
  title: "Haul Road Grade Calculator",
  description:
    "Audit full actual road level profile/grade segments under independent review criterion, signed down grades retained; not scalar ramp angle/run or safe travel assessment. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedObservedRoadGrades",
      label: "Signed observed road grades",
      kind: "numberList",
    },
    {
      id: "roadGradeReviewSegments",
      label: "Road grade review segments",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoadStationM: value.observedRoadStationM as readonly number[],
      observedRoadLevelsM: value.observedRoadLevelsM as readonly number[],
      callerMaximumAbsoluteGradeFraction:
        value.callerMaximumAbsoluteGradeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
