import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly commandedAnglesDegrees: readonly number[];
  readonly measuredAnglesDegrees: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanErrorArcseconds: number;
  readonly rmsErrorArcseconds: number;
  readonly maximumAbsoluteErrorArcseconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.commandedAnglesDegrees.length === 0 ||
    input.commandedAnglesDegrees.length !== input.measuredAnglesDegrees.length
  )
    simpleError(
      "commandedAnglesDegrees",
      "Angle lists must be aligned and nonempty.",
      "invalid_samples",
    );
  const errors = input.commandedAnglesDegrees.map(
    (value, index) => (input.measuredAnglesDegrees[index] - value) * 3600,
  );
  const meanErrorArcseconds = errors.reduce((a, b) => a + b, 0) / errors.length;
  return {
    meanErrorArcseconds,
    rmsErrorArcseconds: Math.sqrt(
      errors.reduce((sum, value) => sum + value * value, 0) / errors.length,
    ),
    maximumAbsoluteErrorArcseconds: Math.max(...errors.map(Math.abs)),
  };
};

export const exampleInput = {
  commandedAnglesDegrees: [0, 1, 2],
  measuredAnglesDegrees: [0, 1.001, 1.999],
} satisfies Input;
export const exampleOutput = {
  meanErrorArcseconds: 0,
  rmsErrorArcseconds: 2.93938769133949,
  maximumAbsoluteErrorArcseconds: 3.5999999999996035,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      commandedAnglesDegrees: input.commandedAnglesDegrees as readonly number[],
      measuredAnglesDegrees: input.measuredAnglesDegrees as readonly number[],
    }),
  description: "Summarize rotary-axis calibration errors in arcseconds.",
  id: "laser/rotary-axis-calibration",
  inputs: [
    {
      id: "commandedAnglesDegrees",
      label: "Commanded angles",
      kind: "numberList",
      unit: "°",
    },
    {
      id: "measuredAnglesDegrees",
      label: "Measured angles",
      kind: "numberList",
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "meanErrorArcseconds",
      label: "Mean rotary error",
      kind: "number",
      unit: "arcsec",
    },
    {
      id: "rmsErrorArcseconds",
      label: "RMS rotary error",
      kind: "number",
      minimum: 0,
      unit: "arcsec",
    },
    {
      id: "maximumAbsoluteErrorArcseconds",
      label: "Maximum absolute error",
      kind: "number",
      minimum: 0,
      unit: "arcsec",
    },
  ],
  title: "Rotary-Axis Calibration",
});

export const run = tool.execute;
export default tool;
