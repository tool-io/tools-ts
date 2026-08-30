import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstCohortStarted: number;
  readonly firstCohortActivated: number;
  readonly secondCohortStarted: number;
  readonly secondCohortActivated: number;
}>;
export type Output = Readonly<{
  readonly firstActivationPercent: number;
  readonly secondActivationPercent: number;
  readonly changePoints: number;
}>;
export const calculate = (input: Input): Output => {
  const v = input;
  if (
    !Number.isSafeInteger(v.firstCohortStarted) ||
    !Number.isSafeInteger(v.secondCohortStarted) ||
    v.firstCohortStarted <= 0 ||
    v.secondCohortStarted <= 0 ||
    !Number.isSafeInteger(v.firstCohortActivated) ||
    !Number.isSafeInteger(v.secondCohortActivated) ||
    v.firstCohortActivated < 0 ||
    v.secondCohortActivated < 0 ||
    v.firstCohortActivated > v.firstCohortStarted ||
    v.secondCohortActivated > v.secondCohortStarted
  )
    simpleError(
      "firstCohortStarted",
      "Valid started and activated counts in both cohorts required.",
    );
  const firstActivationPercent =
      (100 * v.firstCohortActivated) / v.firstCohortStarted,
    secondActivationPercent =
      (100 * v.secondCohortActivated) / v.secondCohortStarted;
  return {
    firstActivationPercent,
    secondActivationPercent,
    changePoints: secondActivationPercent - firstActivationPercent,
  };
};
export const exampleInput = {
  firstCohortStarted: 100,
  firstCohortActivated: 30,
  secondCohortStarted: 80,
  secondCohortActivated: 40,
} satisfies Input;
export const exampleOutput = {
  firstActivationPercent: 30,
  secondActivationPercent: 50,
  changePoints: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/activation-cohort-comparison",
  title: "Activation Cohort Comparison",
  description:
    "Compare activation rates between two consistently defined signup cohorts.",
  inputs: [
    { id: "firstCohortStarted", label: "First cohort started", kind: "number" },
    {
      id: "firstCohortActivated",
      label: "First cohort activated",
      kind: "number",
    },
    {
      id: "secondCohortStarted",
      label: "Second cohort started",
      kind: "number",
    },
    {
      id: "secondCohortActivated",
      label: "Second cohort activated",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "firstActivationPercent",
      label: "First activation percent",
      kind: "number",
    },
    {
      id: "secondActivationPercent",
      label: "Second activation percent",
      kind: "number",
    },
    { id: "changePoints", label: "Change points", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firstCohortStarted: value.firstCohortStarted as number,
      firstCohortActivated: value.firstCohortActivated as number,
      secondCohortStarted: value.secondCohortStarted as number,
      secondCohortActivated: value.secondCohortActivated as number,
    }),
});
export const run = tool.execute;
export default tool;
