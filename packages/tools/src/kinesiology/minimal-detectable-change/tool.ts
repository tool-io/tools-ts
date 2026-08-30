import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly standardErrorMeasurement: number;
  readonly confidenceZ: number;
  readonly observedChange: number;
}>;
export type Output = Readonly<{
  readonly mdc: number;
  readonly exceedsMdc: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.standardErrorMeasurement < 0 ||
    input.confidenceZ <= 0 ||
    input.observedChange < 0
  )
    simpleError(
      "standardErrorMeasurement",
      "Nonnegative SEM/change and positive normal critical value required.",
    );
  const mdc = input.confidenceZ * Math.SQRT2 * input.standardErrorMeasurement;
  return { mdc, exceedsMdc: input.observedChange > mdc };
};
export const exampleInput = {
  standardErrorMeasurement: 5,
  confidenceZ: 1.96,
  observedChange: 14,
} satisfies Input;
export const exampleOutput = {
  mdc: 13.85929291125633,
  exceedsMdc: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/minimal-detectable-change",
  title: "Minimal Detectable Change",
  description:
    "Compare observed change with z×√2×SEM minimal detectable change.",
  inputs: [
    {
      id: "standardErrorMeasurement",
      label: "Standard error measurement",
      kind: "number",
    },
    { id: "confidenceZ", label: "Confidence z", kind: "number" },
    { id: "observedChange", label: "Observed change", kind: "number" },
  ],
  outputs: [
    { id: "mdc", label: "Mdc", kind: "number" },
    { id: "exceedsMdc", label: "Exceeds mdc", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      standardErrorMeasurement: value.standardErrorMeasurement as number,
      confidenceZ: value.confidenceZ as number,
      observedChange: value.observedChange as number,
    }),
});
export const run = tool.execute;
export default tool;
