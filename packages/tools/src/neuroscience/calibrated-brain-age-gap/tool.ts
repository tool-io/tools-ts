import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly predictedAgesYears: readonly number[];
  readonly chronologicalAgesYears: readonly number[];
  readonly calibrationInterceptYears: number;
  readonly calibrationSlope: number;
}>;
export type Output = Readonly<{
  readonly rawGapsYears: readonly number[];
  readonly calibratedGapsYears: readonly number[];
}>;
const inputFields = [
  {
    id: "predictedAgesYears",
    label: "Predicted ages years",
    kind: "numberList",
  },
  {
    id: "chronologicalAgesYears",
    label: "Chronological ages years",
    kind: "numberList",
  },
  {
    id: "calibrationInterceptYears",
    label: "Calibration intercept years",
    kind: "number",
  },
  { id: "calibrationSlope", label: "Calibration slope", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.predictedAgesYears,
    input.chronologicalAgesYears,
    "predictedAgesYears",
  );
  input.predictedAgesYears.forEach((v) => nonnegative(v, "predictedAgesYears"));
  input.chronologicalAgesYears.forEach((v) =>
    nonnegative(v, "chronologicalAgesYears"),
  );
  positive(input.calibrationSlope, "calibrationSlope");
  return {
    rawGapsYears: input.predictedAgesYears.map(
      (v, i) => v - input.chronologicalAgesYears[i],
    ),
    calibratedGapsYears: input.predictedAgesYears.map(
      (v, i) =>
        (v - input.calibrationInterceptYears) / input.calibrationSlope -
        input.chronologicalAgesYears[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  predictedAgesYears: [50, 60],
  chronologicalAgesYears: [40, 60],
  calibrationInterceptYears: 10,
  calibrationSlope: 0.8,
} satisfies Input;
export const exampleOutput = {
  rawGapsYears: [10, 0],
  calibratedGapsYears: [10, 2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/calibrated-brain-age-gap",
  title: "Brain Age Gap",
  description:
    "Report raw predicted-minus-chronological brain-age gaps and invert a caller-supplied training calibration predicted=a+b·age; not a disease or biological-age diagnosis.",
  inputs: inputFields,
  outputs: [
    { id: "rawGapsYears", label: "Raw gaps years", kind: "numberList" },
    {
      id: "calibratedGapsYears",
      label: "Calibrated gaps years",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      predictedAgesYears: value.predictedAgesYears as readonly number[],
      chronologicalAgesYears: value.chronologicalAgesYears as readonly number[],
      calibrationInterceptYears: value.calibrationInterceptYears as number,
      calibrationSlope: value.calibrationSlope as number,
    }),
});
export const run = tool.execute;
export default tool;
