import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly leftStanceSeconds: number;
  readonly rightStanceSeconds: number;
}>;
export type Output = Readonly<{
  readonly meanStanceSeconds: number;
  readonly asymmetryPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.leftStanceSeconds <= 0 || input.rightStanceSeconds <= 0)
    simpleError(
      "leftStanceSeconds",
      "Positive left and right stance durations required.",
    );
  const meanStanceSeconds =
    (input.leftStanceSeconds + input.rightStanceSeconds) / 2;
  return {
    meanStanceSeconds,
    asymmetryPercent:
      (100 * Math.abs(input.leftStanceSeconds - input.rightStanceSeconds)) /
      meanStanceSeconds,
  };
};
export const exampleInput = {
  leftStanceSeconds: 0.6,
  rightStanceSeconds: 0.4,
} satisfies Input;
export const exampleOutput = {
  meanStanceSeconds: 0.5,
  asymmetryPercent: 39.99999999999999,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/antalgic-stance-asymmetry",
  title: "Antalgic Stance Asymmetry",
  description:
    "Quantify left/right gait stance-time asymmetry relative to their mean.",
  inputs: [
    { id: "leftStanceSeconds", label: "Left stance seconds", kind: "number" },
    { id: "rightStanceSeconds", label: "Right stance seconds", kind: "number" },
  ],
  outputs: [
    { id: "meanStanceSeconds", label: "Mean stance seconds", kind: "number" },
    { id: "asymmetryPercent", label: "Asymmetry percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      leftStanceSeconds: value.leftStanceSeconds as number,
      rightStanceSeconds: value.rightStanceSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
