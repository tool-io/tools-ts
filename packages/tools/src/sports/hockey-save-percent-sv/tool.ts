import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedShotsOnGoal: number;
  readonly observedGoalsAllowed: number;
}>;
export type Output = Readonly<{ readonly observedSavePercent: number }>;
const inputFields = [
  {
    id: "observedShotsOnGoal",
    label: "Observed shots on goal",
    kind: "number",
  },
  {
    id: "observedGoalsAllowed",
    label: "Observed goals allowed",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedShotsOnGoal, "shots", 1, 1000000);
  bounded(input.observedGoalsAllowed, "goals", 0, input.observedShotsOnGoal);
  return {
    observedSavePercent:
      (100 * (input.observedShotsOnGoal - input.observedGoalsAllowed)) /
      input.observedShotsOnGoal,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShotsOnGoal: 30,
  observedGoalsAllowed: 3,
} satisfies Input;
export const exampleOutput = { observedSavePercent: 90 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/hockey-save-percent-sv",
  title: "Hockey Save % Calculator",
  description:
    "Hockey actual saves per observed shots on goal; excludes blocked/missed shots and shootout conventions caller resolves.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSavePercent",
      label: "Observed save percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShotsOnGoal: value.observedShotsOnGoal as number,
      observedGoalsAllowed: value.observedGoalsAllowed as number,
    }),
});
export const run = tool.execute;
export default tool;
