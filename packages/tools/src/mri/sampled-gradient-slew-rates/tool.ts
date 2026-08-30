import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly gradientMilliTeslaPerMeter: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalSlewTeslaPerMeterSecond: readonly number[];
  readonly maximumAbsoluteSlew: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList", unit: "ms" },
  {
    id: "gradientMilliTeslaPerMeter",
    label: "Gradient milli tesla per meter",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.timesMs, "timesMs");
  aligned(input.timesMs, input.gradientMilliTeslaPerMeter, "timesMs");
  const intervalSlewTeslaPerMeterSecond = input.timesMs
    .slice(1)
    .map(
      (v, i) =>
        (input.gradientMilliTeslaPerMeter[i + 1] -
          input.gradientMilliTeslaPerMeter[i]) /
        (v - input.timesMs[i]),
    );
  return {
    intervalSlewTeslaPerMeterSecond,
    maximumAbsoluteSlew: Math.max(
      ...intervalSlewTeslaPerMeterSecond.map(Math.abs),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 1, 3],
  gradientMilliTeslaPerMeter: [0, 10, -10],
} satisfies Input;
export const exampleOutput = {
  intervalSlewTeslaPerMeterSecond: [10, -10],
  maximumAbsoluteSlew: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/sampled-gradient-slew-rates",
  title: "Gradient Slew Rate",
  description:
    "Measure signed piecewise-linear gradient slew from timestamped mT/m samples; mT/m per ms equals T/m/s and between-sample excursions are not observable.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalSlewTeslaPerMeterSecond",
      label: "Interval slew tesla per meter second",
      kind: "numberList",
    },
    {
      id: "maximumAbsoluteSlew",
      label: "Maximum absolute slew",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      gradientMilliTeslaPerMeter:
        value.gradientMilliTeslaPerMeter as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
