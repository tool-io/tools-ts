import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedGoalsAllowed: number;
  readonly observedGoalieMinutes: number;
  readonly callerRegulationMinutes: number;
}>;
export type Output = Readonly<{ readonly observedGoalsAgainstAverage: number }>;
const inputFields = [
  {
    id: "observedGoalsAllowed",
    label: "Observed goals allowed",
    kind: "number",
  },
  {
    id: "observedGoalieMinutes",
    label: "Observed goalie minutes",
    kind: "number",
  },
  {
    id: "callerRegulationMinutes",
    label: "Caller regulation minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedGoalsAllowed, "goals", 0, 1000000);
  positive(input.observedGoalieMinutes, "minutes");
  positive(input.callerRegulationMinutes, "regulation");
  return {
    observedGoalsAgainstAverage:
      (input.observedGoalsAllowed * input.callerRegulationMinutes) /
      input.observedGoalieMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGoalsAllowed: 3,
  observedGoalieMinutes: 120,
  callerRegulationMinutes: 60,
} satisfies Input;
export const exampleOutput = {
  observedGoalsAgainstAverage: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/hockey-goals-against-average-gaa",
  title: "Hockey GAA Calculator",
  description:
    "Hockey actual goals per caller regulation duration from observed goalie time, no default league duration or save-percentage alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGoalsAgainstAverage",
      label: "Observed goals against average",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGoalsAllowed: value.observedGoalsAllowed as number,
      observedGoalieMinutes: value.observedGoalieMinutes as number,
      callerRegulationMinutes: value.callerRegulationMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
