import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, sum, cards } from "../shared.js";
export type Input = Readonly<{
  readonly startingRunningCount: number;
  readonly observedRanks: readonly string[];
}>;
export type Output = Readonly<{
  readonly updatedHiLoRunningCount: number;
  readonly perCardHiLoContributions: readonly number[];
}>;
const inputFields = [
  {
    id: "startingRunningCount",
    label: "Starting running count",
    kind: "number",
  },
  { id: "observedRanks", label: "Observed ranks", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.startingRunningCount) ||
    Math.abs(input.startingRunningCount) > 1000000
  )
    simpleError("count", "Bounded signed starting count required.");
  const deltas = input.observedRanks.map((s) => {
    if (!/^[2-9TJQKA]$(?![\s\S])/.test(s))
      return simpleError(
        "rank",
        "One standard rank token required; repeated cards across decks are allowed.",
      );
    return "23456".includes(s) ? 1 : "TJQKA".includes(s) ? -1 : 0;
  });
  return {
    updatedHiLoRunningCount: input.startingRunningCount + sum(deltas),
    perCardHiLoContributions: deltas,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  startingRunningCount: 0,
  observedRanks: ["2", "5", "T", "A", "7"],
} satisfies Input;
export const exampleOutput = {
  updatedHiLoRunningCount: 0,
  perCardHiLoContributions: [1, 1, -1, -1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/blackjack-hi-lo-running-count-update",
  title: "Hi-Lo Running Count Update",
  description:
    "Update observed multi-deck Hi-Lo count by explicit card-rank ledger, preserving signed count; not an advantage/profit guarantee or a substitute for remaining-deck evidence.",
  inputs: inputFields,
  outputs: [
    {
      id: "updatedHiLoRunningCount",
      label: "Updated hi lo running count",
      kind: "number",
    },
    {
      id: "perCardHiLoContributions",
      label: "Per card hi lo contributions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      startingRunningCount: value.startingRunningCount as number,
      observedRanks: value.observedRanks as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
