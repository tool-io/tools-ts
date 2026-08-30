import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count } from "../shared.js";

export type Input = Readonly<{
  readonly initialPositive: number;
  readonly initialTested: number;
  readonly followupPositive: number;
  readonly followupTested: number;
  readonly elapsedYears: number;
}>;
export type Output = Readonly<{
  readonly annualRetentionFraction: number;
  readonly annualLossPercent: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.initialPositive, "initialPositive", 1);
  count(input.initialTested, "initialTested", 1);
  count(input.followupPositive, "followupPositive");
  count(input.followupTested, "followupTested", 1);
  positive(input.elapsedYears, "elapsedYears");
  if (
    input.initialPositive > input.initialTested ||
    input.followupPositive > input.followupTested
  )
    simpleError("initialPositive", "Positives cannot exceed tested subjects.");
  const ratio =
    input.followupPositive /
    input.followupTested /
    (input.initialPositive / input.initialTested);
  if (ratio > 1)
    simpleError(
      "followupPositive",
      "A waning-only model requires nonincreasing observed seropositivity.",
    );
  const annualRetentionFraction = ratio ** (1 / input.elapsedYears);
  return {
    annualRetentionFraction,
    annualLossPercent: 100 * (1 - annualRetentionFraction),
  };
};
export const exampleInput = {
  initialPositive: 80,
  initialTested: 100,
  followupPositive: 40,
  followupTested: 100,
  elapsedYears: 2,
} satisfies Input;
export const exampleOutput = {
  annualRetentionFraction: 0.7071067811865476,
  annualLossPercent: 29.28932188134524,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/seropositivity-waning-fit",
  title: "Seropositivity Waning Fit",
  description:
    "Fit annual seropositivity retention from two cohort proportions under a waning-only model; new exposure and assay changes are not modeled.",
  inputs: [
    {
      id: "initialPositive",
      label: "Initial positive",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "initialTested",
      label: "Initial tested",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "followupPositive",
      label: "Followup positive",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "followupTested",
      label: "Followup tested",
      kind: "integer",
      minimum: 1,
    },
    { id: "elapsedYears", label: "Elapsed years", kind: "number" },
  ],
  outputs: [
    {
      id: "annualRetentionFraction",
      label: "Annual retention fraction",
      kind: "number",
    },
    { id: "annualLossPercent", label: "Annual loss percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      initialPositive: value.initialPositive as number,
      initialTested: value.initialTested as number,
      followupPositive: value.followupPositive as number,
      followupTested: value.followupTested as number,
      elapsedYears: value.elapsedYears as number,
    }),
});
export const run = tool.execute;
export default tool;
