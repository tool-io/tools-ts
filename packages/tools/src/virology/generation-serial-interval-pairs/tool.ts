import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned, mean } from "../shared.js";

export type Input = Readonly<{
  readonly sourceInfectionDays: readonly number[];
  readonly recipientInfectionDays: readonly number[];
  readonly sourceOnsetDays: readonly number[];
  readonly recipientOnsetDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly generationIntervalsDays: readonly number[];
  readonly serialIntervalsDays: readonly number[];
  readonly meanIntervalDifferenceDays: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.sourceInfectionDays,
    input.recipientInfectionDays,
    "sourceInfectionDays",
  );
  aligned(
    input.sourceInfectionDays,
    input.sourceOnsetDays,
    "sourceInfectionDays",
  );
  aligned(
    input.sourceInfectionDays,
    input.recipientOnsetDays,
    "sourceInfectionDays",
  );
  if (
    input.sourceInfectionDays.some(
      (v, i) =>
        input.recipientInfectionDays[i] < v ||
        input.sourceOnsetDays[i] < v ||
        input.recipientOnsetDays[i] < input.recipientInfectionDays[i],
    )
  )
    simpleError(
      "recipientInfectionDays",
      "Infection must precede its corresponding symptom onset; generation intervals cannot be negative.",
    );
  const generationIntervalsDays = input.sourceInfectionDays.map(
      (v, i) => input.recipientInfectionDays[i] - v,
    ),
    serialIntervalsDays = input.sourceOnsetDays.map(
      (v, i) => input.recipientOnsetDays[i] - v,
    );
  return {
    generationIntervalsDays,
    serialIntervalsDays,
    meanIntervalDifferenceDays:
      mean(serialIntervalsDays) - mean(generationIntervalsDays),
  };
};
export const exampleInput = {
  sourceInfectionDays: [0, 2],
  recipientInfectionDays: [4, 8],
  sourceOnsetDays: [2, 5],
  recipientOnsetDays: [7, 9],
} satisfies Input;
export const exampleOutput = {
  generationIntervalsDays: [4, 6],
  serialIntervalsDays: [5, 4],
  meanIntervalDifferenceDays: -0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/generation-serial-interval-pairs",
  title: "Generation Serial Interval Pairs",
  description:
    "Derive paired infection-to-infection and onset-to-onset intervals, retaining possible negative serial intervals.",
  inputs: [
    {
      id: "sourceInfectionDays",
      label: "Source infection days",
      kind: "numberList",
    },
    {
      id: "recipientInfectionDays",
      label: "Recipient infection days",
      kind: "numberList",
    },
    { id: "sourceOnsetDays", label: "Source onset days", kind: "numberList" },
    {
      id: "recipientOnsetDays",
      label: "Recipient onset days",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "generationIntervalsDays",
      label: "Generation intervals days",
      kind: "numberList",
    },
    {
      id: "serialIntervalsDays",
      label: "Serial intervals days",
      kind: "numberList",
    },
    {
      id: "meanIntervalDifferenceDays",
      label: "Mean interval difference days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceInfectionDays: value.sourceInfectionDays as readonly number[],
      recipientInfectionDays: value.recipientInfectionDays as readonly number[],
      sourceOnsetDays: value.sourceOnsetDays as readonly number[],
      recipientOnsetDays: value.recipientOnsetDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
