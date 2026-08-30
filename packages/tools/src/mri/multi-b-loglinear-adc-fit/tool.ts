import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly bValuesSecondsPerSquareMm: readonly number[];
  readonly diffusionSignals: readonly number[];
}>;
export type Output = Readonly<{
  readonly adcSquareMmPerSecond: number;
  readonly extrapolatedS0: number;
  readonly logFitRSquared: number;
}>;
const inputFields = [
  {
    id: "bValuesSecondsPerSquareMm",
    label: "B values seconds per square mm",
    kind: "numberList",
    unit: "mm",
  },
  { id: "diffusionSignals", label: "Diffusion signals", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.bValuesSecondsPerSquareMm, "bValuesSecondsPerSquareMm");
  input.bValuesSecondsPerSquareMm.forEach((v) =>
    nonnegative(v, "bValuesSecondsPerSquareMm"),
  );
  input.diffusionSignals.forEach((v) => positive(v, "diffusionSignals"));
  const fit = regression(
    input.bValuesSecondsPerSquareMm,
    input.diffusionSignals.map(Math.log),
  );
  return {
    adcSquareMmPerSecond: -fit.slope,
    extrapolatedS0: Math.exp(fit.intercept),
    logFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bValuesSecondsPerSquareMm: [0, 500, 1000],
  diffusionSignals: [100, 60.653065971263345, 36.787944117144235],
} satisfies Input;
export const exampleOutput = {
  adcSquareMmPerSecond: 0.001,
  extrapolatedS0: 100,
  logFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/multi-b-loglinear-adc-fit",
  title: "ADC Calculation",
  description:
    "Fit apparent diffusion coefficient from all supplied b-value/log-signal observations; rising signals yield a preserved negative ADC estimate rather than a fabricated nonnegative diffusivity.",
  inputs: inputFields,
  outputs: [
    {
      id: "adcSquareMmPerSecond",
      label: "Adc square mm per second",
      kind: "number",
    },
    { id: "extrapolatedS0", label: "Extrapolated s0", kind: "number" },
    { id: "logFitRSquared", label: "Log fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      bValuesSecondsPerSquareMm:
        value.bValuesSecondsPerSquareMm as readonly number[],
      diffusionSignals: value.diffusionSignals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
