import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly spinPeriodSeconds: number;
  readonly periodDerivativeSecondsPerSecond: number;
}>;
export type Output = Readonly<{ readonly characteristicAgeSeconds: number }>;
const inputFields = [
  { id: "spinPeriodSeconds", label: "Spin period seconds", kind: "number" },
  {
    id: "periodDerivativeSecondsPerSecond",
    label: "Period derivative seconds per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.spinPeriodSeconds, "spinPeriodSeconds");
  positive(
    input.periodDerivativeSecondsPerSecond,
    "periodDerivativeSecondsPerSecond",
  );
  return {
    characteristicAgeSeconds:
      input.spinPeriodSeconds / (2 * input.periodDerivativeSecondsPerSecond),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spinPeriodSeconds: 1,
  periodDerivativeSecondsPerSecond: 1e-12,
} satisfies Input;
export const exampleOutput = {
  characteristicAgeSeconds: 500000000000.0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/pulsar-spin-down-age-characteristic",
  title: "Pulsar Characteristic Spin-Down Age",
  description:
    "Pulsar P/(2 Pdot) characteristic spin-down timescale assumes braking index 3 and negligible birth period, not measured true age. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "characteristicAgeSeconds",
      label: "Characteristic age seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spinPeriodSeconds: value.spinPeriodSeconds as number,
      periodDerivativeSecondsPerSecond:
        value.periodDerivativeSecondsPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
