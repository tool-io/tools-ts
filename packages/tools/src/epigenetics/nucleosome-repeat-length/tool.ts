import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly peakPositionsBp: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanRepeatLengthBp: number;
  readonly minimumSpacingBp: number;
  readonly maximumSpacingBp: number;
  readonly spacingStdDevBp: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.peakPositionsBp.length < 2 ||
    input.peakPositionsBp.some(
      (value, index) => index > 0 && value <= input.peakPositionsBp[index - 1],
    )
  )
    simpleError(
      "peakPositionsBp",
      "At least two increasing peak positions are required.",
      "invalid_peaks",
    );
  const gaps = input.peakPositionsBp
      .slice(1)
      .map((value, index) => value - input.peakPositionsBp[index]),
    meanRepeatLengthBp = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  return {
    meanRepeatLengthBp,
    minimumSpacingBp: Math.min(...gaps),
    maximumSpacingBp: Math.max(...gaps),
    spacingStdDevBp: Math.sqrt(
      gaps.reduce((sum, value) => sum + (value - meanRepeatLengthBp) ** 2, 0) /
        gaps.length,
    ),
  };
};

export const exampleInput = { peakPositionsBp: [0, 200, 410] } satisfies Input;
export const exampleOutput = {
  meanRepeatLengthBp: 205,
  minimumSpacingBp: 200,
  maximumSpacingBp: 210,
  spacingStdDevBp: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      peakPositionsBp: input.peakPositionsBp as readonly number[],
    }),
  description:
    "Estimate nucleosome repeat length from ordered periodicity peaks.",
  id: "epigenetics/nucleosome-repeat-length",
  inputs: [
    {
      id: "peakPositionsBp",
      label: "Nucleosome peak positions",
      kind: "numberList",
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "meanRepeatLengthBp",
      label: "Mean repeat length",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "minimumSpacingBp",
      label: "Minimum peak spacing",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "maximumSpacingBp",
      label: "Maximum peak spacing",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "spacingStdDevBp",
      label: "Spacing standard deviation",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
  ],
  title: "Nucleosome Repeat Length",
});

export const run = tool.execute;
export default tool;
