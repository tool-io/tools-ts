import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, sinePositive } from "../shared.js";

export type Input = Readonly<{
  readonly dailyMinimumTemperaturesC: readonly number[];
  readonly dailyMaximumTemperaturesC: readonly number[];
  readonly lowerDevelopmentThresholdC: number;
  readonly upperHorizontalThresholdC: number;
}>;
export type Output = Readonly<{
  readonly singleSineDegreeDays: readonly number[];
  readonly accumulatedSingleSineDegreeDays: number;
}>;
const inputFields = [
  {
    id: "dailyMinimumTemperaturesC",
    label: "Daily minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "dailyMaximumTemperaturesC",
    label: "Daily maximum temperatures c",
    kind: "numberList",
  },
  {
    id: "lowerDevelopmentThresholdC",
    label: "Lower development threshold c",
    kind: "number",
  },
  {
    id: "upperHorizontalThresholdC",
    label: "Upper horizontal threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.dailyMinimumTemperaturesC,
    input.dailyMaximumTemperaturesC,
    "dailyMinimumTemperaturesC",
  );
  if (input.upperHorizontalThresholdC <= input.lowerDevelopmentThresholdC)
    simpleError(
      "thresholds",
      "Increasing lower/upper horizontal cutoffs required.",
    );
  const singleSineDegreeDays = input.dailyMinimumTemperaturesC.map(
    (v, i) =>
      sinePositive(
        v,
        input.dailyMaximumTemperaturesC[i],
        input.lowerDevelopmentThresholdC,
      ) -
      sinePositive(
        v,
        input.dailyMaximumTemperaturesC[i],
        input.upperHorizontalThresholdC,
      ),
  );
  return {
    singleSineDegreeDays,
    accumulatedSingleSineDegreeDays: singleSineDegreeDays.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMinimumTemperaturesC: [0],
  dailyMaximumTemperaturesC: [20],
  lowerDevelopmentThresholdC: 10,
  upperHorizontalThresholdC: 20,
} satisfies Input;
export const exampleOutput = {
  singleSineDegreeDays: [3.183098861837907],
  accumulatedSingleSineDegreeDays: 3.183098861837907,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/gdd-single-sine",
  title: "Growing Degree Days Single Sinusoid Method",
  description:
    "Integrate ideal single-sinusoid daily temperature excess between caller lower and horizontal upper cutoffs analytically; differs from arithmetic daily-mean GDD and is not a development-event forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "singleSineDegreeDays",
      label: "Single sine degree days",
      kind: "numberList",
    },
    {
      id: "accumulatedSingleSineDegreeDays",
      label: "Accumulated single sine degree days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyMinimumTemperaturesC:
        value.dailyMinimumTemperaturesC as readonly number[],
      dailyMaximumTemperaturesC:
        value.dailyMaximumTemperaturesC as readonly number[],
      lowerDevelopmentThresholdC: value.lowerDevelopmentThresholdC as number,
      upperHorizontalThresholdC: value.upperHorizontalThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
