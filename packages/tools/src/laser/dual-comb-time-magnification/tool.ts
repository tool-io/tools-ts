import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstRepetitionRateHertz: number;
  readonly secondRepetitionRateHertz: number;
}>;
export type Output = Readonly<{
  readonly differenceRateHertz: number;
  readonly interferogramPeriodSeconds: number;
  readonly timeMagnification: number;
}>;

export const calculate = (input: Input): Output => {
  const differenceRateHertz = Math.abs(
    input.firstRepetitionRateHertz - input.secondRepetitionRateHertz,
  );
  if (differenceRateHertz === 0)
    simpleError(
      "secondRepetitionRateHertz",
      "Repetition rates must differ.",
      "zero_difference",
    );
  return {
    differenceRateHertz,
    interferogramPeriodSeconds: 1 / differenceRateHertz,
    timeMagnification: input.firstRepetitionRateHertz / differenceRateHertz,
  };
};

export const exampleInput = {
  firstRepetitionRateHertz: 100000000,
  secondRepetitionRateHertz: 99999000,
} satisfies Input;
export const exampleOutput = {
  differenceRateHertz: 1000,
  interferogramPeriodSeconds: 0.001,
  timeMagnification: 100000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstRepetitionRateHertz: input.firstRepetitionRateHertz as number,
      secondRepetitionRateHertz: input.secondRepetitionRateHertz as number,
    }),
  description:
    "Calculate dual-comb asynchronous sampling period and time magnification.",
  id: "laser/dual-comb-time-magnification",
  inputs: [
    {
      id: "firstRepetitionRateHertz",
      label: "First comb repetition rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "secondRepetitionRateHertz",
      label: "Second comb repetition rate",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "differenceRateHertz",
      label: "Repetition-rate difference",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "interferogramPeriodSeconds",
      label: "Interferogram period",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "timeMagnification",
      label: "Asynchronous time magnification",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Dual-Comb Time Magnification",
});

export const run = tool.execute;
export default tool;
