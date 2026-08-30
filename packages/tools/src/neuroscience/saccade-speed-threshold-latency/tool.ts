import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  onset,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly speedsDegreesPerSecond: readonly number[];
  readonly cueTimeMs: number;
  readonly onsetSpeedDegreesPerSecond: number;
}>;
export type Output = Readonly<{
  readonly saccadeOnsetMs: number;
  readonly latencyMs: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  {
    id: "speedsDegreesPerSecond",
    label: "Speeds degrees per second",
    kind: "numberList",
  },
  { id: "cueTimeMs", label: "Cue time ms", kind: "number" },
  {
    id: "onsetSpeedDegreesPerSecond",
    label: "Onset speed degrees per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.speedsDegreesPerSecond.forEach((v) =>
    nonnegative(v, "speedsDegreesPerSecond"),
  );
  positive(input.onsetSpeedDegreesPerSecond, "onsetSpeedDegreesPerSecond");
  const saccadeOnsetMs = onset(
    input.timesMs,
    input.speedsDegreesPerSecond,
    input.cueTimeMs,
    input.onsetSpeedDegreesPerSecond,
    1,
  );
  return { saccadeOnsetMs, latencyMs: saccadeOnsetMs - input.cueTimeMs };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 10, 20, 30],
  speedsDegreesPerSecond: [0, 0, 100, 100],
  cueTimeMs: 10,
  onsetSpeedDegreesPerSecond: 50,
} satisfies Input;
export const exampleOutput = {
  saccadeOnsetMs: 15,
  latencyMs: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/saccade-speed-threshold-latency",
  title: "Saccade Latency",
  description:
    "Interpolate the first supplied eye-speed threshold crossing after a cue; blink rejection and direction classification are not inferred.",
  inputs: inputFields,
  outputs: [
    { id: "saccadeOnsetMs", label: "Saccade onset ms", kind: "number" },
    { id: "latencyMs", label: "Latency ms", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      speedsDegreesPerSecond: value.speedsDegreesPerSecond as readonly number[],
      cueTimeMs: value.cueTimeMs as number,
      onsetSpeedDegreesPerSecond: value.onsetSpeedDegreesPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
