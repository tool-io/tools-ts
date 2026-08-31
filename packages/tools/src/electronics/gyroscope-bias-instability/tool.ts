import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly averagingTimesSeconds: readonly number[];
  readonly observedAllanDeviationsDegreesHour: readonly number[];
  readonly callerPlateauLogSlopeTolerance: number;
  readonly callerFlickerConversionFactor: number;
}>;
export type Output = Readonly<{
  readonly minimumObservedAllanDeviationDegreesHour: number;
  readonly minimumAtAveragingSeconds: number;
  readonly flickerPlateauEvidencePresent: boolean;
  readonly candidateBiasInstabilityDegreesHour: number;
}>;
const inputFields = [
  {
    id: "averagingTimesSeconds",
    label: "Averaging times seconds",
    kind: "numberList",
  },
  {
    id: "observedAllanDeviationsDegreesHour",
    label: "Observed allan deviations degrees hour",
    kind: "numberList",
  },
  {
    id: "callerPlateauLogSlopeTolerance",
    label: "Caller plateau log slope tolerance",
    kind: "number",
  },
  {
    id: "callerFlickerConversionFactor",
    label: "Caller flicker conversion factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.averagingTimesSeconds.forEach((v) =>
    positive(v, "averagingTimesSeconds"),
  );
  input.observedAllanDeviationsDegreesHour.forEach((v) =>
    positive(v, "observedAllanDeviationsDegreesHour"),
  );
  positive(
    input.callerFlickerConversionFactor,
    "callerFlickerConversionFactor",
  );
  nonnegative(
    input.callerPlateauLogSlopeTolerance,
    "callerPlateauLogSlopeTolerance",
  );
  aligned(
    input.averagingTimesSeconds,
    input.observedAllanDeviationsDegreesHour,
    "averagingTimesSeconds",
  );
  strictlyIncreasing(input.averagingTimesSeconds, "tau");
  const values = input.observedAllanDeviationsDegreesHour,
    min = Math.min(...values),
    i = values.indexOf(min);
  if (values.filter((v) => v === min).length !== 1)
    simpleError(
      "minimum",
      "Unique observed Allan minimum required; tied plateaus need external resolved estimate.",
    );
  const slope =
      i > 0 && i < values.length - 1
        ? (Math.log(values[i + 1]) - Math.log(values[i - 1])) /
          (Math.log(input.averagingTimesSeconds[i + 1]) -
            Math.log(input.averagingTimesSeconds[i - 1]))
        : Infinity,
    plateau =
      Number.isFinite(slope) &&
      Math.abs(slope) <= input.callerPlateauLogSlopeTolerance;
  return {
    minimumObservedAllanDeviationDegreesHour: min,
    minimumAtAveragingSeconds: input.averagingTimesSeconds[i],
    flickerPlateauEvidencePresent: plateau,
    candidateBiasInstabilityDegreesHour: plateau
      ? min / input.callerFlickerConversionFactor
      : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  averagingTimesSeconds: [1, 10, 100],
  observedAllanDeviationsDegreesHour: [2, 1, 2],
  callerPlateauLogSlopeTolerance: 0.1,
  callerFlickerConversionFactor: 0.664,
} satisfies Input;
export const exampleOutput = {
  minimumObservedAllanDeviationDegreesHour: 1,
  minimumAtAveragingSeconds: 10,
  flickerPlateauEvidencePresent: true,
  candidateBiasInstabilityDegreesHour: 1.506024096385542,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/gyroscope-bias-instability",
  title: "Gyroscope Bias Instability Calculator",
  description:
    "Screen observed Allan minimum with caller centered log-slope plateau tolerance and flicker convention factor; candidate only, a symmetric minimum is not proof of flicker noise, no raw-signal Allan estimator or certified gyro bias.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumObservedAllanDeviationDegreesHour",
      label: "Minimum observed allan deviation degrees hour",
      kind: "number",
    },
    {
      id: "minimumAtAveragingSeconds",
      label: "Minimum at averaging seconds",
      kind: "number",
    },
    {
      id: "flickerPlateauEvidencePresent",
      label: "Flicker plateau evidence present",
      kind: "boolean",
    },
    {
      id: "candidateBiasInstabilityDegreesHour",
      label: "Candidate bias instability degrees hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      averagingTimesSeconds: value.averagingTimesSeconds as readonly number[],
      observedAllanDeviationsDegreesHour:
        value.observedAllanDeviationsDegreesHour as readonly number[],
      callerPlateauLogSlopeTolerance:
        value.callerPlateauLogSlopeTolerance as number,
      callerFlickerConversionFactor:
        value.callerFlickerConversionFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
