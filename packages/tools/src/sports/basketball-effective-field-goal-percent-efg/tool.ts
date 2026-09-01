import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedFieldGoalsMade: number;
  readonly observedThreePointFieldGoalsMade: number;
  readonly observedFieldGoalsAttempted: number;
}>;
export type Output = Readonly<{ readonly effectiveFieldGoalPercent: number }>;
const inputFields = [
  {
    id: "observedFieldGoalsMade",
    label: "Observed field goals made",
    kind: "number",
  },
  {
    id: "observedThreePointFieldGoalsMade",
    label: "Observed three point field goals made",
    kind: "number",
  },
  {
    id: "observedFieldGoalsAttempted",
    label: "Observed field goals attempted",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedFieldGoalsAttempted, "attempts", 1, 1000000);
  bounded(
    input.observedFieldGoalsMade,
    "made",
    0,
    input.observedFieldGoalsAttempted,
  );
  bounded(
    input.observedThreePointFieldGoalsMade,
    "threes",
    0,
    input.observedFieldGoalsMade,
  );
  return {
    effectiveFieldGoalPercent:
      (100 *
        (input.observedFieldGoalsMade +
          0.5 * input.observedThreePointFieldGoalsMade)) /
      input.observedFieldGoalsAttempted,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFieldGoalsMade: 10,
  observedThreePointFieldGoalsMade: 4,
  observedFieldGoalsAttempted: 20,
} satisfies Input;
export const exampleOutput = { effectiveFieldGoalPercent: 60 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/basketball-effective-field-goal-percent-efg",
  title: "Basketball eFG% Calculator",
  description:
    "Basketball eFG weights observed made threes as 1.5 total made-shot equivalents; threes subset of made, not true shooting or box-score efficiency.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveFieldGoalPercent",
      label: "Effective field goal percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFieldGoalsMade: value.observedFieldGoalsMade as number,
      observedThreePointFieldGoalsMade:
        value.observedThreePointFieldGoalsMade as number,
      observedFieldGoalsAttempted: value.observedFieldGoalsAttempted as number,
    }),
});
export const run = tool.execute;
export default tool;
