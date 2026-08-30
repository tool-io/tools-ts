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
  aligned,
  ordered,
  interpolate,
  binary,
  runs,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationHours: readonly number[];
  readonly observedTemperaturesC: readonly number[];
  readonly leafWetFlags: readonly number[];
  readonly calibratedTemperatureKnotsC: readonly number[];
  readonly calibratedRequiredWetHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalEquivalentInfectionDoses: readonly number[];
  readonly continuousEpisodeEquivalentDoses: readonly number[];
  readonly callerCalibratedDoseThresholdExceeded: boolean;
}>;
const inputFields = [
  { id: "observationHours", label: "Observation hours", kind: "numberList" },
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  { id: "leafWetFlags", label: "Leaf wet flags", kind: "numberList" },
  {
    id: "calibratedTemperatureKnotsC",
    label: "Calibrated temperature knots c",
    kind: "numberList",
  },
  {
    id: "calibratedRequiredWetHours",
    label: "Calibrated required wet hours",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.leafWetFlags.length * input.calibratedTemperatureKnotsC.length >
    1_000_000
  )
    simpleError(
      "coverage",
      "At most one million interval/calibration comparisons required.",
    );
  input.calibratedRequiredWetHours.forEach((v) =>
    positive(v, "calibratedRequiredWetHours"),
  );
  ordered(input.observationHours, "hours");
  aligned(input.observationHours, input.observedTemperaturesC, "temperatures");
  if (input.leafWetFlags.length !== input.observationHours.length - 1)
    simpleError(
      "wetness",
      "One observed wetness flag per time interval required.",
    );
  binary(input.leafWetFlags, "wetness");
  ordered(input.calibratedTemperatureKnotsC, "calibrationKnots");
  aligned(
    input.calibratedTemperatureKnotsC,
    input.calibratedRequiredWetHours,
    "calibration",
  );
  const dose = input.leafWetFlags.map((v, i) => {
      const t =
          (input.observedTemperaturesC[i] +
            input.observedTemperaturesC[i + 1]) /
          2,
        h = positive(
          interpolate(
            input.calibratedTemperatureKnotsC,
            input.calibratedRequiredWetHours,
            t,
          ),
          "wetHours",
        );
      return (
        (v * (input.observationHours[i + 1] - input.observationHours[i])) / h
      );
    }),
    r = runs(input.leafWetFlags.map((v) => v === 1)),
    episodes = r.starts.map((i, j) =>
      dose.slice(i, i + r.lengths[j]).reduce((a, b) => a + b, 0),
    );
  return {
    intervalEquivalentInfectionDoses: dose,
    continuousEpisodeEquivalentDoses: episodes,
    callerCalibratedDoseThresholdExceeded: episodes.some((v) => v >= 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationHours: [0, 1, 3],
  observedTemperaturesC: [20, 20, 20],
  leafWetFlags: [1, 1],
  calibratedTemperatureKnotsC: [10, 20, 30],
  calibratedRequiredWetHours: [10, 5, 10],
} satisfies Input;
export const exampleOutput = {
  intervalEquivalentInfectionDoses: [0.2, 0.4],
  continuousEpisodeEquivalentDoses: [0.6],
  callerCalibratedDoseThresholdExceeded: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/black-rot-wetness-duration-risk-checker",
  title: "Black Rot Wetness Duration Risk Checker",
  description:
    "Accumulate wet-interval equivalent dose against caller independently calibrated black-rot temperature/wet-duration curve, resetting on dry intervals; midpoint temperature approximation and additive hazard assumption exposed, no infection diagnosis or fungicide guidance.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalEquivalentInfectionDoses",
      label: "Interval equivalent infection doses",
      kind: "numberList",
    },
    {
      id: "continuousEpisodeEquivalentDoses",
      label: "Continuous episode equivalent doses",
      kind: "numberList",
    },
    {
      id: "callerCalibratedDoseThresholdExceeded",
      label: "Caller calibrated dose threshold exceeded",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observationHours: value.observationHours as readonly number[],
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      leafWetFlags: value.leafWetFlags as readonly number[],
      calibratedTemperatureKnotsC:
        value.calibratedTemperatureKnotsC as readonly number[],
      calibratedRequiredWetHours:
        value.calibratedRequiredWetHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
