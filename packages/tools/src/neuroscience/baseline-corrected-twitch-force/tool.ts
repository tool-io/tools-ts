import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, mean, integral, window } from "../shared.js";
export type Input = Readonly<{
  readonly timesMs: readonly number[];
  readonly forcesNewtons: readonly number[];
  readonly baselineStartMs: number;
  readonly baselineEndMs: number;
  readonly twitchStartMs: number;
  readonly twitchEndMs: number;
}>;
export type Output = Readonly<{
  readonly baselineForceNewtons: number;
  readonly peakTwitchForceNewtons: number;
  readonly netTwitchImpulseNewtonMs: number;
}>;
const inputFields = [
  { id: "timesMs", label: "Times ms", kind: "numberList" },
  { id: "forcesNewtons", label: "Forces newtons", kind: "numberList" },
  { id: "baselineStartMs", label: "Baseline start ms", kind: "number" },
  { id: "baselineEndMs", label: "Baseline end ms", kind: "number" },
  { id: "twitchStartMs", label: "Twitch start ms", kind: "number" },
  { id: "twitchEndMs", label: "Twitch end ms", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.baselineEndMs >= input.twitchStartMs)
    simpleError(
      "twitchStartMs",
      "Disjoint baseline and twitch windows required.",
    );
  const baselineForceNewtons = mean(
    window(
      input.timesMs,
      input.forcesNewtons,
      input.baselineStartMs,
      input.baselineEndMs,
    ),
  );
  window(
    input.timesMs,
    input.forcesNewtons,
    input.twitchStartMs,
    input.twitchEndMs,
  );
  const times = input.timesMs.filter(
      (v) => v >= input.twitchStartMs && v <= input.twitchEndMs,
    ),
    net = input.forcesNewtons
      .filter(
        (_, i) =>
          input.timesMs[i] >= input.twitchStartMs &&
          input.timesMs[i] <= input.twitchEndMs,
      )
      .map((v) => v - baselineForceNewtons);
  return {
    baselineForceNewtons,
    peakTwitchForceNewtons: Math.max(...net),
    netTwitchImpulseNewtonMs: integral(times, net),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesMs: [0, 10, 20, 30],
  forcesNewtons: [2, 2, 7, 3],
  baselineStartMs: 0,
  baselineEndMs: 10,
  twitchStartMs: 20,
  twitchEndMs: 30,
} satisfies Input;
export const exampleOutput = {
  baselineForceNewtons: 2,
  peakTwitchForceNewtons: 5,
  netTwitchImpulseNewtonMs: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/baseline-corrected-twitch-force",
  title: "Twitch Force",
  description:
    "Measure sampled twitch peak and net impulse after baseline subtraction across explicit disjoint windows; force must already be calibrated.",
  inputs: inputFields,
  outputs: [
    {
      id: "baselineForceNewtons",
      label: "Baseline force newtons",
      kind: "number",
    },
    {
      id: "peakTwitchForceNewtons",
      label: "Peak twitch force newtons",
      kind: "number",
    },
    {
      id: "netTwitchImpulseNewtonMs",
      label: "Net twitch impulse newton ms",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timesMs: value.timesMs as readonly number[],
      forcesNewtons: value.forcesNewtons as readonly number[],
      baselineStartMs: value.baselineStartMs as number,
      baselineEndMs: value.baselineEndMs as number,
      twitchStartMs: value.twitchStartMs as number,
      twitchEndMs: value.twitchEndMs as number,
    }),
});
export const run = tool.execute;
export default tool;
