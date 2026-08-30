import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly spokenCueSeconds: readonly number[];
  readonly surtitleCueSeconds: readonly number[];
  readonly maximumOffsetSeconds: number;
}>;
export type Output = Readonly<{
  readonly meanAbsoluteOffsetSeconds: number;
  readonly maximumAbsoluteOffsetSeconds: number;
  readonly lateCueCount: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  const n = input.spokenCueSeconds.length;
  if (n === 0 || input.surtitleCueSeconds.length !== n)
    simpleError(
      "spokenCueSeconds",
      "Cue lists must be aligned and nonempty.",
      "invalid_cues",
    );
  const offsets = input.surtitleCueSeconds.map(
      (value, index) => value - input.spokenCueSeconds[index],
    ),
    absolute = offsets.map(Math.abs);
  return {
    meanAbsoluteOffsetSeconds: absolute.reduce((a, b) => a + b, 0) / n,
    maximumAbsoluteOffsetSeconds: Math.max(...absolute),
    lateCueCount: offsets.filter((value) => value > 0).length,
    withinTolerance: absolute.every(
      (value) => value <= input.maximumOffsetSeconds,
    ),
  };
};

export const exampleInput = {
  spokenCueSeconds: [10, 20, 30],
  surtitleCueSeconds: [10, 21, 29],
  maximumOffsetSeconds: 1,
} satisfies Input;
export const exampleOutput = {
  meanAbsoluteOffsetSeconds: 0.6666666666666666,
  maximumAbsoluteOffsetSeconds: 1,
  lateCueCount: 1,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      spokenCueSeconds: input.spokenCueSeconds as readonly number[],
      surtitleCueSeconds: input.surtitleCueSeconds as readonly number[],
      maximumOffsetSeconds: input.maximumOffsetSeconds as number,
    }),
  description: "Measure surtitle cue timing offsets against spoken cues.",
  id: "theatre/surtitle-timing",
  inputs: [
    {
      id: "spokenCueSeconds",
      label: "Spoken cue times",
      kind: "numberList",
      unit: "s",
    },
    {
      id: "surtitleCueSeconds",
      label: "Surtitle cue times",
      kind: "numberList",
      unit: "s",
    },
    {
      id: "maximumOffsetSeconds",
      label: "Maximum cue offset",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "meanAbsoluteOffsetSeconds",
      label: "Mean absolute offset",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "maximumAbsoluteOffsetSeconds",
      label: "Maximum absolute offset",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "lateCueCount",
      label: "Late surtitle count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "withinTolerance",
      label: "All cues within tolerance",
      kind: "boolean",
    },
  ],
  title: "Surtitle Timing",
});

export const run = tool.execute;
export default tool;
