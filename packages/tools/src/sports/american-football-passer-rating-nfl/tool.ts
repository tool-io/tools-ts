import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, sum } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPassAttempts: number;
  readonly observedCompletions: number;
  readonly observedPassingYards: number;
  readonly observedPassingTouchdowns: number;
  readonly observedInterceptions: number;
}>;
export type Output = Readonly<{
  readonly nflComponentScores: readonly number[];
  readonly nflPasserRating: number;
}>;
const inputFields = [
  {
    id: "observedPassAttempts",
    label: "Observed pass attempts",
    kind: "number",
  },
  { id: "observedCompletions", label: "Observed completions", kind: "number" },
  {
    id: "observedPassingYards",
    label: "Observed passing yards",
    kind: "number",
  },
  {
    id: "observedPassingTouchdowns",
    label: "Observed passing touchdowns",
    kind: "number",
  },
  {
    id: "observedInterceptions",
    label: "Observed interceptions",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedPassAttempts, "attempts", 1, 1000000);
  bounded(
    input.observedCompletions,
    "completions",
    0,
    input.observedPassAttempts,
  );
  bounded(input.observedPassingTouchdowns, "td", 0, input.observedCompletions);
  bounded(
    input.observedInterceptions,
    "interceptions",
    0,
    input.observedPassAttempts - input.observedCompletions,
  );
  if (
    !Number.isSafeInteger(input.observedPassingYards) ||
    Math.abs(input.observedPassingYards) > 1000000
  )
    simpleError("yards", "Bounded integer signed passing yards required.");
  const attempts = input.observedPassAttempts,
    clip = (v: number) => Math.max(0, Math.min(2.375, v)),
    components = [
      clip((input.observedCompletions / attempts - 0.3) * 5),
      clip((input.observedPassingYards / attempts - 3) * 0.25),
      clip((input.observedPassingTouchdowns / attempts) * 20),
      clip(2.375 - (input.observedInterceptions / attempts) * 25),
    ];
  return {
    nflComponentScores: components,
    nflPasserRating: (sum(components) / 6) * 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPassAttempts: 20,
  observedCompletions: 10,
  observedPassingYards: 200,
  observedPassingTouchdowns: 2,
  observedInterceptions: 1,
} satisfies Input;
export const exampleOutput = {
  nflComponentScores: [1, 1.75, 2, 1.125],
  nflPasserRating: 97.91666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/american-football-passer-rating-nfl",
  title: "NFL Passer Rating Calculator",
  description:
    "Named NFL passer rating actual completion/yard/TD/interception components clipped independently to [0,2.375]; not NCAA formula, QBR, rushing contribution or outcome prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "nflComponentScores",
      label: "Nfl component scores",
      kind: "numberList",
    },
    { id: "nflPasserRating", label: "Nfl passer rating", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedPassAttempts: value.observedPassAttempts as number,
      observedCompletions: value.observedCompletions as number,
      observedPassingYards: value.observedPassingYards as number,
      observedPassingTouchdowns: value.observedPassingTouchdowns as number,
      observedInterceptions: value.observedInterceptions as number,
    }),
});
export const run = tool.execute;
export default tool;
