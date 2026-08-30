import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly restingBpm: number;
  readonly maximumBpm: number;
  readonly lowerReserveFraction: number;
  readonly upperReserveFraction: number;
}>;
export type Output = Readonly<{
  readonly reserveBpm: number;
  readonly lowerTargetBpm: number;
  readonly upperTargetBpm: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.restingBpm < 0 ||
    input.maximumBpm <= input.restingBpm ||
    input.lowerReserveFraction < 0 ||
    input.upperReserveFraction > 1 ||
    input.lowerReserveFraction > input.upperReserveFraction
  )
    simpleError(
      "maximumBpm",
      "Maximum heart rate must exceed rest and reserve fractions must be ordered in [0,1].",
    );
  const reserveBpm = input.maximumBpm - input.restingBpm;
  return {
    reserveBpm,
    lowerTargetBpm: input.restingBpm + reserveBpm * input.lowerReserveFraction,
    upperTargetBpm: input.restingBpm + reserveBpm * input.upperReserveFraction,
  };
};
export const exampleInput = {
  restingBpm: 60,
  maximumBpm: 180,
  lowerReserveFraction: 0.5,
  upperReserveFraction: 0.7,
} satisfies Input;
export const exampleOutput = {
  reserveBpm: 120,
  lowerTargetBpm: 120,
  upperTargetBpm: 144,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/heart-rate-reserve-zone",
  title: "Heart Rate Reserve Zone",
  description: "Compute Karvonen heart-rate reserve training zone boundaries.",
  inputs: [
    { id: "restingBpm", label: "Resting bpm", kind: "number" },
    { id: "maximumBpm", label: "Maximum bpm", kind: "number" },
    {
      id: "lowerReserveFraction",
      label: "Lower reserve fraction",
      kind: "number",
    },
    {
      id: "upperReserveFraction",
      label: "Upper reserve fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "reserveBpm", label: "Reserve bpm", kind: "number" },
    { id: "lowerTargetBpm", label: "Lower target bpm", kind: "number" },
    { id: "upperTargetBpm", label: "Upper target bpm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      restingBpm: value.restingBpm as number,
      maximumBpm: value.maximumBpm as number,
      lowerReserveFraction: value.lowerReserveFraction as number,
      upperReserveFraction: value.upperReserveFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
