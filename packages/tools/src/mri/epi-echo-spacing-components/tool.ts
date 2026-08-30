import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly readoutDurationMs: number;
  readonly turnaroundGradientMs: number;
  readonly settlingMs: number;
  readonly configuredEchoSpacingMs: number;
}>;
export type Output = Readonly<{
  readonly minimumEchoSpacingMs: number;
  readonly configuredMarginMs: number;
  readonly timingFits: boolean;
}>;
const inputFields = [
  {
    id: "readoutDurationMs",
    label: "Readout duration ms",
    kind: "number",
    unit: "ms",
  },
  {
    id: "turnaroundGradientMs",
    label: "Turnaround gradient ms",
    kind: "number",
    unit: "ms",
  },
  { id: "settlingMs", label: "Settling ms", kind: "number", unit: "ms" },
  {
    id: "configuredEchoSpacingMs",
    label: "Configured echo spacing ms",
    kind: "number",
    unit: "ms",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.readoutDurationMs, "readoutDurationMs");
  nonnegative(input.turnaroundGradientMs, "turnaroundGradientMs");
  nonnegative(input.settlingMs, "settlingMs");
  positive(input.configuredEchoSpacingMs, "configuredEchoSpacingMs");
  const minimumEchoSpacingMs =
      input.readoutDurationMs + input.turnaroundGradientMs + input.settlingMs,
    configuredMarginMs = input.configuredEchoSpacingMs - minimumEchoSpacingMs;
  return {
    minimumEchoSpacingMs,
    configuredMarginMs,
    timingFits: configuredMarginMs >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  readoutDurationMs: 1,
  turnaroundGradientMs: 0.2,
  settlingMs: 0.1,
  configuredEchoSpacingMs: 1.5,
} satisfies Input;
export const exampleOutput = {
  minimumEchoSpacingMs: 1.3,
  configuredMarginMs: 0.2,
  timingFits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/epi-echo-spacing-components",
  title: "Echo Spacing",
  description:
    "Budget echo-center spacing from explicitly nonoverlapping readout, turnaround and settling intervals; waveform overlaps require a different timing model.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumEchoSpacingMs",
      label: "Minimum echo spacing ms",
      kind: "number",
      unit: "ms",
    },
    {
      id: "configuredMarginMs",
      label: "Configured margin ms",
      kind: "number",
      unit: "ms",
    },
    { id: "timingFits", label: "Timing fits", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      readoutDurationMs: value.readoutDurationMs as number,
      turnaroundGradientMs: value.turnaroundGradientMs as number,
      settlingMs: value.settlingMs as number,
      configuredEchoSpacingMs: value.configuredEchoSpacingMs as number,
    }),
});
export const run = tool.execute;
export default tool;
