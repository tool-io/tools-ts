import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly minimalGrowthOd: number;
  readonly completeGrowthOd: number;
  readonly supplementedGrowthOd: number;
  readonly minimumGrowthOd: number;
}>;
export type Output = Readonly<{
  readonly minimalGrowthDetected: boolean;
  readonly completeGrowthDetected: boolean;
  readonly supplementRescuesGrowth: boolean;
  readonly auxotrophyPattern: boolean;
}>;
export const calculate = (input: Input): Output => {
  [
    input.minimalGrowthOd,
    input.completeGrowthOd,
    input.supplementedGrowthOd,
  ].forEach((v) => nonnegative(v, "minimalGrowthOd"));
  positive(input.minimumGrowthOd, "minimumGrowthOd");
  const minimalGrowthDetected = input.minimalGrowthOd >= input.minimumGrowthOd,
    completeGrowthDetected = input.completeGrowthOd >= input.minimumGrowthOd,
    supplementRescuesGrowth =
      !minimalGrowthDetected &&
      input.supplementedGrowthOd >= input.minimumGrowthOd;
  return {
    minimalGrowthDetected,
    completeGrowthDetected,
    supplementRescuesGrowth,
    auxotrophyPattern:
      !minimalGrowthDetected &&
      completeGrowthDetected &&
      supplementRescuesGrowth,
  };
};
export const exampleInput = {
  minimalGrowthOd: 0.05,
  completeGrowthOd: 0.5,
  supplementedGrowthOd: 0.4,
  minimumGrowthOd: 0.2,
} satisfies Input;
export const exampleOutput = {
  minimalGrowthDetected: false,
  completeGrowthDetected: true,
  supplementRescuesGrowth: true,
  auxotrophyPattern: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/minimal-medium-rescue-screen",
  title: "Minimal Medium Rescue Screen",
  description:
    "Screen paired minimal, complete, and supplemented-medium observations for a growth-rescue pattern; does not identify the deficient pathway.",
  inputs: [
    { id: "minimalGrowthOd", label: "Minimal growth od", kind: "number" },
    { id: "completeGrowthOd", label: "Complete growth od", kind: "number" },
    {
      id: "supplementedGrowthOd",
      label: "Supplemented growth od",
      kind: "number",
    },
    { id: "minimumGrowthOd", label: "Minimum growth od", kind: "number" },
  ],
  outputs: [
    {
      id: "minimalGrowthDetected",
      label: "Minimal growth detected",
      kind: "boolean",
    },
    {
      id: "completeGrowthDetected",
      label: "Complete growth detected",
      kind: "boolean",
    },
    {
      id: "supplementRescuesGrowth",
      label: "Supplement rescues growth",
      kind: "boolean",
    },
    { id: "auxotrophyPattern", label: "Auxotrophy pattern", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      minimalGrowthOd: value.minimalGrowthOd as number,
      completeGrowthOd: value.completeGrowthOd as number,
      supplementedGrowthOd: value.supplementedGrowthOd as number,
      minimumGrowthOd: value.minimumGrowthOd as number,
    }),
});
export const run = tool.execute;
export default tool;
