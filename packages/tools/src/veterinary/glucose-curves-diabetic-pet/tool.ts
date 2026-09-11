import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  nonnegative,
  sum,
  strictlyIncreasing,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedGlucoseTimesHours: readonly number[];
  readonly independentlyMeasuredGlucoseConcentrations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedGlucoseTimesHours",
    label: "Independently recorded glucose times hours",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredGlucoseConcentrations",
    label: "Independently measured glucose concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyRecordedGlucoseTimesHours,
    input.independentlyMeasuredGlucoseConcentrations,
    "samples",
  );
  strictlyIncreasing(input.independentlyRecordedGlucoseTimesHours, "time", 2);
  input.independentlyMeasuredGlucoseConcentrations.forEach((v) =>
    nonnegative(v, "glucose"),
  );
  const a = sum(
      input.independentlyRecordedGlucoseTimesHours
        .slice(1)
        .map(
          (v, i) =>
            ((v - input.independentlyRecordedGlucoseTimesHours[i]) *
              (input.independentlyMeasuredGlucoseConcentrations[i] +
                input.independentlyMeasuredGlucoseConcentrations[i + 1])) /
            2,
        ),
    ),
    t =
      input.independentlyRecordedGlucoseTimesHours.at(-1)! -
      input.independentlyRecordedGlucoseTimesHours[0],
    m = Math.min(...input.independentlyMeasuredGlucoseConcentrations);
  return {
    observedTrapezoidalGlucoseExposure: a,
    observedTimeWeightedGlucoseMean: a / t,
    observedGlucoseNadir: m,
    observedNadirTimesHours:
      input.independentlyRecordedGlucoseTimesHours.filter(
        (_, i) => input.independentlyMeasuredGlucoseConcentrations[i] === m,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedGlucoseTimesHours: [0, 2, 4],
    independentlyMeasuredGlucoseConcentrations: [100, 200, 100],
  },
  output: {
    result: {
      observedTrapezoidalGlucoseExposure: 600,
      observedTimeWeightedGlucoseMean: 150,
      observedGlucoseNadir: 100,
      observedNadirTimesHours: [0, 4],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/glucose-curves-diabetic-pet",
  title: "Diabetic Pet Glucose Curve Tool",
  description:
    "Actual diabetic-pet glucose curve sampled nadir/ties and piecewise-linear exposure, caller same-unit concentration. No insulin starting/titration dose, clinical target, continuous unsampled nadir or safe glycemia approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
