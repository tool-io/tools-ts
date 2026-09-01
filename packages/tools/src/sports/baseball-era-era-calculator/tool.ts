import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedEarnedRuns: number;
  readonly observedOutsRecorded: number;
}>;
export type Output = Readonly<{
  readonly earnedRunAveragePerNineInnings: number;
}>;
const inputFields = [
  { id: "observedEarnedRuns", label: "Observed earned runs", kind: "number" },
  {
    id: "observedOutsRecorded",
    label: "Observed outs recorded",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedEarnedRuns, "runs", 0, 1000000);
  bounded(input.observedOutsRecorded, "outs", 1, 1000000);
  return {
    earnedRunAveragePerNineInnings:
      (27 * input.observedEarnedRuns) / input.observedOutsRecorded,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEarnedRuns: 3,
  observedOutsRecorded: 18,
} satisfies Input;
export const exampleOutput = {
  earnedRunAveragePerNineInnings: 4.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/baseball-era-era-calculator",
  title: "Baseball ERA Calculator",
  description:
    "Baseball ERA from actual earned runs and integer outs, three outs per inning; excludes unearned runs and decimal innings ambiguity.",
  inputs: inputFields,
  outputs: [
    {
      id: "earnedRunAveragePerNineInnings",
      label: "Earned run average per nine innings",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEarnedRuns: value.observedEarnedRuns as number,
      observedOutsRecorded: value.observedOutsRecorded as number,
    }),
});
export const run = tool.execute;
export default tool;
