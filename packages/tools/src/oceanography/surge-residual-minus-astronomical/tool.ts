import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  ordered,
  maximum,
  minimum,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationTimesHours: readonly number[];
  readonly observedWaterLevelsM: readonly number[];
  readonly tidePredictionTimesHours: readonly number[];
  readonly predictedTideLevelsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly surgeResidualsM: readonly number[];
  readonly maximumResidualM: number;
  readonly minimumResidualM: number;
}>;
const inputFields = [
  {
    id: "observationTimesHours",
    label: "Observation times hours",
    kind: "numberList",
  },
  {
    id: "observedWaterLevelsM",
    label: "Observed water levels m",
    kind: "numberList",
  },
  {
    id: "tidePredictionTimesHours",
    label: "Tide prediction times hours",
    kind: "numberList",
  },
  {
    id: "predictedTideLevelsM",
    label: "Predicted tide levels m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observationTimesHours,
    input.observedWaterLevelsM,
    "observationTimesHours",
  );
  ordered(input.observationTimesHours, "observationTimesHours");
  const surgeResidualsM = input.observedWaterLevelsM.map(
    (v, i) =>
      v -
      interpolate(
        input.tidePredictionTimesHours,
        input.predictedTideLevelsM,
        input.observationTimesHours[i],
      ),
  );
  return {
    surgeResidualsM,
    maximumResidualM: maximum(surgeResidualsM),
    minimumResidualM: minimum(surgeResidualsM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationTimesHours: [0, 1, 2],
  observedWaterLevelsM: [1, 3, 2],
  tidePredictionTimesHours: [0, 2],
  predictedTideLevelsM: [1, 1],
} satisfies Input;
export const exampleOutput = {
  surgeResidualsM: [0, 2, 1],
  maximumResidualM: 2,
  minimumResidualM: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/surge-residual-minus-astronomical",
  title: "Surge Residual Minus Astronomical",
  description:
    "Subtract a bracketed interpolated astronomical-tide series from observed levels on the same datum; residual includes all non-tidal errors/processes, not purely meteorological surge.",
  inputs: inputFields,
  outputs: [
    { id: "surgeResidualsM", label: "Surge residuals m", kind: "numberList" },
    { id: "maximumResidualM", label: "Maximum residual m", kind: "number" },
    { id: "minimumResidualM", label: "Minimum residual m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observationTimesHours: value.observationTimesHours as readonly number[],
      observedWaterLevelsM: value.observedWaterLevelsM as readonly number[],
      tidePredictionTimesHours:
        value.tidePredictionTimesHours as readonly number[],
      predictedTideLevelsM: value.predictedTideLevelsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
