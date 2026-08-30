import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly speedMps: number;
  readonly cadenceStepsPerMinute: number;
  readonly stepLengthM: number;
}>;
export type Output = Readonly<{
  readonly solvedField: string;
  readonly solvedValue: number;
}>;
export const calculate = (input: Input): Output => {
  const { speedMps, cadenceStepsPerMinute, stepLengthM } = input,
    values = [speedMps, cadenceStepsPerMinute, stepLengthM];
  if (values.some((v) => v < 0) || values.filter((v) => v === 0).length !== 1)
    simpleError(
      "speedMps",
      "Provide exactly two positive values and zero for the unknown variable.",
    );
  if (speedMps === 0)
    return {
      solvedField: "speedMps",
      solvedValue: (cadenceStepsPerMinute * stepLengthM) / 60,
    };
  if (cadenceStepsPerMinute === 0)
    return {
      solvedField: "cadenceStepsPerMinute",
      solvedValue: (60 * speedMps) / stepLengthM,
    };
  return {
    solvedField: "stepLengthM",
    solvedValue: (60 * speedMps) / cadenceStepsPerMinute,
  };
};
export const exampleInput = {
  speedMps: 0,
  cadenceStepsPerMinute: 120,
  stepLengthM: 0.75,
} satisfies Input;
export const exampleOutput = {
  solvedField: "speedMps",
  solvedValue: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/cadence-stride-speed-solver",
  title: "Cadence Stride Speed Solver",
  description:
    "Solve one missing gait speed, step cadence, or step length from the other two.",
  inputs: [
    { id: "speedMps", label: "Speed mps", kind: "number" },
    {
      id: "cadenceStepsPerMinute",
      label: "Cadence steps per minute",
      kind: "number",
    },
    { id: "stepLengthM", label: "Step length m", kind: "number" },
  ],
  outputs: [
    { id: "solvedField", label: "Solved field", kind: "string" },
    { id: "solvedValue", label: "Solved value", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      speedMps: value.speedMps as number,
      cadenceStepsPerMinute: value.cadenceStepsPerMinute as number,
      stepLengthM: value.stepLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
