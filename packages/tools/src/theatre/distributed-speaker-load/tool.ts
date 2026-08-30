import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly speakerTapWatts: readonly number[];
  readonly amplifierRatedWatts: number;
  readonly maximumLoadPercent: number;
}>;
export type Output = Readonly<{
  readonly connectedLoadWatts: number;
  readonly allowedLoadWatts: number;
  readonly headroomWatts: number;
  readonly withinLoadLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.speakerTapWatts.some((value) => value < 0))
    simpleError(
      "speakerTapWatts",
      "Speaker taps must be nonnegative.",
      "invalid_taps",
    );
  const connectedLoadWatts = input.speakerTapWatts.reduce((a, b) => a + b, 0),
    allowedLoadWatts =
      (input.amplifierRatedWatts * input.maximumLoadPercent) / 100;
  return {
    connectedLoadWatts,
    allowedLoadWatts,
    headroomWatts: allowedLoadWatts - connectedLoadWatts,
    withinLoadLimit: connectedLoadWatts <= allowedLoadWatts,
  };
};

export const exampleInput = {
  speakerTapWatts: [10, 20, 20],
  amplifierRatedWatts: 100,
  maximumLoadPercent: 80,
} satisfies Input;
export const exampleOutput = {
  connectedLoadWatts: 50,
  allowedLoadWatts: 80,
  headroomWatts: 30,
  withinLoadLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      speakerTapWatts: input.speakerTapWatts as readonly number[],
      amplifierRatedWatts: input.amplifierRatedWatts as number,
      maximumLoadPercent: input.maximumLoadPercent as number,
    }),
  description:
    "Total distributed-speaker taps against an amplifier loading limit.",
  id: "theatre/distributed-speaker-load",
  inputs: [
    {
      id: "speakerTapWatts",
      label: "Speaker tap powers",
      kind: "numberList",
      unit: "W",
    },
    {
      id: "amplifierRatedWatts",
      label: "Amplifier rated power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "maximumLoadPercent",
      label: "Maximum rated load",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "connectedLoadWatts",
      label: "Connected speaker load",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "allowedLoadWatts",
      label: "Allowed amplifier load",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    { id: "headroomWatts", label: "Load headroom", kind: "number", unit: "W" },
    {
      id: "withinLoadLimit",
      label: "Within supplied load limit",
      kind: "boolean",
    },
  ],
  title: "Distributed Speaker Load",
});

export const run = tool.execute;
export default tool;
