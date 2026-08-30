import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly dayThreePositive: number;
  readonly dayThreeAssessed: number;
  readonly maximumPositiveFraction: number;
}>;
export type Output = Readonly<{
  readonly dayThreePositivePercent: number;
  readonly exceedsSurveillanceCutoff: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.dayThreePositive, "dayThreePositive");
  count(input.dayThreeAssessed, "dayThreeAssessed", 1);
  fraction(input.maximumPositiveFraction, "maximumPositiveFraction");
  if (input.dayThreePositive > input.dayThreeAssessed)
    simpleError(
      "dayThreePositive",
      "Positives cannot exceed assessed subjects.",
    );
  const ratio = input.dayThreePositive / input.dayThreeAssessed;
  return {
    dayThreePositivePercent: 100 * ratio,
    exceedsSurveillanceCutoff: ratio > input.maximumPositiveFraction,
  };
};
export const exampleInput = {
  dayThreePositive: 8,
  dayThreeAssessed: 100,
  maximumPositiveFraction: 0.05,
} satisfies Input;
export const exampleOutput = {
  dayThreePositivePercent: 8,
  exceedsSurveillanceCutoff: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/day-three-positivity-screen",
  title: "Day Three Positivity Screen",
  description:
    "Screen observed day-three positivity against an explicit surveillance cutoff; does not establish resistance.",
  inputs: [
    { id: "dayThreePositive", label: "Day three positive", kind: "integer" },
    { id: "dayThreeAssessed", label: "Day three assessed", kind: "integer" },
    {
      id: "maximumPositiveFraction",
      label: "Maximum positive fraction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "dayThreePositivePercent",
      label: "Day three positive percent",
      kind: "number",
    },
    {
      id: "exceedsSurveillanceCutoff",
      label: "Exceeds surveillance cutoff",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      dayThreePositive: value.dayThreePositive as number,
      dayThreeAssessed: value.dayThreeAssessed as number,
      maximumPositiveFraction: value.maximumPositiveFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
