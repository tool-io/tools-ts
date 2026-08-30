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
  readonly observedTemperaturesC: readonly number[];
  readonly observedVaporPressuresHpa: readonly number[];
  readonly representedHours: readonly number[];
  readonly callerHumidexThreshold: number;
}>;
export type Output = Readonly<{
  readonly humidexValues: readonly number[];
  readonly exposureWeightedHumidex: number;
  readonly hoursAboveCallerHumidexThreshold: number;
}>;
const inputFields = [
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
  {
    id: "observedVaporPressuresHpa",
    label: "Observed vapor pressures hpa",
    kind: "numberList",
  },
  { id: "representedHours", label: "Represented hours", kind: "numberList" },
  {
    id: "callerHumidexThreshold",
    label: "Caller humidex threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedHours.forEach((v) => positive(v, "representedHours"));
  input.observedVaporPressuresHpa.forEach((v) =>
    nonnegative(v, "observedVaporPressuresHpa"),
  );
  aligned(
    input.observedTemperaturesC,
    input.observedVaporPressuresHpa,
    "observedTemperaturesC",
  );
  aligned(
    input.observedTemperaturesC,
    input.representedHours,
    "observedTemperaturesC",
  );
  const humidexValues = input.observedTemperaturesC.map(
      (t, i) => t + (5 / 9) * (input.observedVaporPressuresHpa[i] - 10),
    ),
    total = input.representedHours.reduce((a, b) => a + b, 0);
  return {
    humidexValues,
    exposureWeightedHumidex: humidexValues.reduce(
      (s, v, i) => s + (v * input.representedHours[i]) / total,
      0,
    ),
    hoursAboveCallerHumidexThreshold: humidexValues.reduce(
      (s, v, i) =>
        s + (v > input.callerHumidexThreshold ? input.representedHours[i] : 0),
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTemperaturesC: [20, 30],
  observedVaporPressuresHpa: [10, 28],
  representedHours: [1, 3],
  callerHumidexThreshold: 35,
} satisfies Input;
export const exampleOutput = {
  humidexValues: [20, 40],
  exposureWeightedHumidex: 35,
  hoursAboveCallerHumidexThreshold: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/humidex-monthly-stats",
  title: "Humidex Monthly Statistics",
  description:
    "Summarize measured vapor-pressure/temperature humidex across actual represented monthly exposure; no RH/dewpoint saturation reconstruction or health recommendation.",
  inputs: inputFields,
  outputs: [
    { id: "humidexValues", label: "Humidex values", kind: "numberList" },
    {
      id: "exposureWeightedHumidex",
      label: "Exposure weighted humidex",
      kind: "number",
    },
    {
      id: "hoursAboveCallerHumidexThreshold",
      label: "Hours above caller humidex threshold",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
      observedVaporPressuresHpa:
        value.observedVaporPressuresHpa as readonly number[],
      representedHours: value.representedHours as readonly number[],
      callerHumidexThreshold: value.callerHumidexThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
