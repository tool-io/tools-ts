import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly walkDistanceM: number;
  readonly comfortableSeconds: number;
  readonly fastSeconds: number;
}>;
export type Output = Readonly<{
  readonly comfortableMps: number;
  readonly fastMps: number;
  readonly fastGainPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.walkDistanceM <= 0 ||
    input.comfortableSeconds <= 0 ||
    input.fastSeconds <= 0
  )
    simpleError(
      "walkDistanceM",
      "Positive measured walk distance and both completion times required.",
    );
  const comfortableMps = input.walkDistanceM / input.comfortableSeconds,
    fastMps = input.walkDistanceM / input.fastSeconds;
  return {
    comfortableMps,
    fastMps,
    fastGainPercent: 100 * (fastMps / comfortableMps - 1),
  };
};
export const exampleInput = {
  walkDistanceM: 10,
  comfortableSeconds: 10,
  fastSeconds: 8,
} satisfies Input;
export const exampleOutput = {
  comfortableMps: 1,
  fastMps: 1.25,
  fastGainPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/ten-meter-gait-speed",
  title: "Ten Meter Gait Speed",
  description:
    "Compare comfortable and fast gait velocities over the same measured walkway.",
  inputs: [
    { id: "walkDistanceM", label: "Walk distance m", kind: "number" },
    { id: "comfortableSeconds", label: "Comfortable seconds", kind: "number" },
    { id: "fastSeconds", label: "Fast seconds", kind: "number" },
  ],
  outputs: [
    { id: "comfortableMps", label: "Comfortable mps", kind: "number" },
    { id: "fastMps", label: "Fast mps", kind: "number" },
    { id: "fastGainPercent", label: "Fast gain percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      walkDistanceM: value.walkDistanceM as number,
      comfortableSeconds: value.comfortableSeconds as number,
      fastSeconds: value.fastSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
