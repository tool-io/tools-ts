import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCadenceRpm: readonly number[];
  readonly frontChainringTeeth: readonly number[];
  readonly rearCogTeeth: readonly number[];
  readonly measuredLoadedWheelCircumferenceMeters: number;
}>;
export type Output = Readonly<{
  readonly idealGearedSpeedKmHour: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCadenceRpm",
    label: "Observed cadence rpm",
    kind: "numberList",
  },
  {
    id: "frontChainringTeeth",
    label: "Front chainring teeth",
    kind: "numberList",
  },
  { id: "rearCogTeeth", label: "Rear cog teeth", kind: "numberList" },
  {
    id: "measuredLoadedWheelCircumferenceMeters",
    label: "Measured loaded wheel circumference meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.measuredLoadedWheelCircumferenceMeters,
    "measuredLoadedWheelCircumferenceMeters",
  );
  input.observedCadenceRpm.forEach((v) => nonnegative(v, "observedCadenceRpm"));
  aligned(
    input.observedCadenceRpm,
    input.frontChainringTeeth,
    "observedCadenceRpm",
  );
  aligned(input.observedCadenceRpm, input.rearCogTeeth, "observedCadenceRpm");
  [...input.frontChainringTeeth, ...input.rearCogTeeth].forEach((v) =>
    bounded(v, "teeth", 1, 200),
  );
  return {
    idealGearedSpeedKmHour: input.observedCadenceRpm.map(
      (v, i) =>
        (((v * input.frontChainringTeeth[i]) / input.rearCogTeeth[i]) *
          input.measuredLoadedWheelCircumferenceMeters *
          60) /
        1000,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCadenceRpm: [60, 90],
  frontChainringTeeth: [50, 50],
  rearCogTeeth: [25, 20],
  measuredLoadedWheelCircumferenceMeters: 2,
} satisfies Input;
export const exampleOutput = {
  idealGearedSpeedKmHour: [14.4, 27],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/cycling-cadence-to-speed",
  title: "Cycling Cadence to Speed Calculator",
  description:
    "Translate actual cadence/gearing/wheel rollout observations into ideal no-slip cycling speed, no physiological cadence or tire/road safety recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealGearedSpeedKmHour",
      label: "Ideal geared speed km hour",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCadenceRpm: value.observedCadenceRpm as readonly number[],
      frontChainringTeeth: value.frontChainringTeeth as readonly number[],
      rearCogTeeth: value.rearCogTeeth as readonly number[],
      measuredLoadedWheelCircumferenceMeters:
        value.measuredLoadedWheelCircumferenceMeters as number,
    }),
});
export const run = tool.execute;
export default tool;
