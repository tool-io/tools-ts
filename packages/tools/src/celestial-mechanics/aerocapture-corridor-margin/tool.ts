import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly minimumEntryAngleDegrees: number;
  readonly maximumEntryAngleDegrees: number;
  readonly predictedEntryAngleDegrees: number;
  readonly uncertaintyHalfWidthDegrees: number;
}>;
export type Output = Readonly<{
  readonly uncertaintyLowerDegrees: number;
  readonly uncertaintyUpperDegrees: number;
  readonly worstCorridorMarginDegrees: number;
  readonly uncertaintyBandInsideCorridor: boolean;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.uncertaintyHalfWidthDegrees, "uncertaintyHalfWidthDegrees");
  if (
    input.minimumEntryAngleDegrees >= input.maximumEntryAngleDegrees ||
    input.minimumEntryAngleDegrees < -90 ||
    input.maximumEntryAngleDegrees > 0
  )
    simpleError(
      "minimumEntryAngleDegrees",
      "Ordered downward-entry corridor angles in [-90,0] required.",
    );
  const uncertaintyLowerDegrees =
      input.predictedEntryAngleDegrees - input.uncertaintyHalfWidthDegrees,
    uncertaintyUpperDegrees =
      input.predictedEntryAngleDegrees + input.uncertaintyHalfWidthDegrees,
    worstCorridorMarginDegrees = Math.min(
      uncertaintyLowerDegrees - input.minimumEntryAngleDegrees,
      input.maximumEntryAngleDegrees - uncertaintyUpperDegrees,
    );
  return {
    uncertaintyLowerDegrees,
    uncertaintyUpperDegrees,
    worstCorridorMarginDegrees,
    uncertaintyBandInsideCorridor: worstCorridorMarginDegrees >= 0,
  };
};
export const exampleInput = {
  minimumEntryAngleDegrees: -8,
  maximumEntryAngleDegrees: -5,
  predictedEntryAngleDegrees: -6,
  uncertaintyHalfWidthDegrees: 0.5,
} satisfies Input;
export const exampleOutput = {
  uncertaintyLowerDegrees: -6.5,
  uncertaintyUpperDegrees: -5.5,
  worstCorridorMarginDegrees: 0.5,
  uncertaintyBandInsideCorridor: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/aerocapture-corridor-margin",
  title: "Aerocapture Corridor Margin",
  description:
    "Audit a predicted entry-angle uncertainty band against a supplied aerocapture corridor; no atmosphere-specific corridor is embedded.",
  inputs: [
    {
      id: "minimumEntryAngleDegrees",
      label: "Minimum entry angle degrees",
      kind: "number",
    },
    {
      id: "maximumEntryAngleDegrees",
      label: "Maximum entry angle degrees",
      kind: "number",
    },
    {
      id: "predictedEntryAngleDegrees",
      label: "Predicted entry angle degrees",
      kind: "number",
    },
    {
      id: "uncertaintyHalfWidthDegrees",
      label: "Uncertainty half width degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "uncertaintyLowerDegrees",
      label: "Uncertainty lower degrees",
      kind: "number",
    },
    {
      id: "uncertaintyUpperDegrees",
      label: "Uncertainty upper degrees",
      kind: "number",
    },
    {
      id: "worstCorridorMarginDegrees",
      label: "Worst corridor margin degrees",
      kind: "number",
    },
    {
      id: "uncertaintyBandInsideCorridor",
      label: "Uncertainty band inside corridor",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      minimumEntryAngleDegrees: value.minimumEntryAngleDegrees as number,
      maximumEntryAngleDegrees: value.maximumEntryAngleDegrees as number,
      predictedEntryAngleDegrees: value.predictedEntryAngleDegrees as number,
      uncertaintyHalfWidthDegrees: value.uncertaintyHalfWidthDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
