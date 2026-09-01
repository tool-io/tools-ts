import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRoundPuttCounts: readonly number[];
  readonly observedHolesPlayed: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPuttsPerHole: number;
  readonly normalizedPuttsPer18Holes: number;
}>;
const inputFields = [
  {
    id: "observedRoundPuttCounts",
    label: "Observed round putt counts",
    kind: "numberList",
  },
  {
    id: "observedHolesPlayed",
    label: "Observed holes played",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.observedRoundPuttCounts, input.observedHolesPlayed, "rounds");
  input.observedRoundPuttCounts.forEach((v) => bounded(v, "putts", 0, 1000));
  input.observedHolesPlayed.forEach((v) => bounded(v, "holes", 1, 72));
  const rate =
    sum(input.observedRoundPuttCounts) / sum(input.observedHolesPlayed);
  return { observedPuttsPerHole: rate, normalizedPuttsPer18Holes: rate * 18 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoundPuttCounts: [30, 20],
  observedHolesPlayed: [18, 9],
} satisfies Input;
export const exampleOutput = {
  observedPuttsPerHole: 1.8518518518518519,
  normalizedPuttsPer18Holes: 33.333333333333336,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/golf-putting-per-round-average",
  title: "Putts Per Round Average Calculator",
  description:
    "Pool actual partial/full golf rounds by observed holes, not average of unequal round totals or putting skill diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPuttsPerHole",
      label: "Observed putts per hole",
      kind: "number",
    },
    {
      id: "normalizedPuttsPer18Holes",
      label: "Normalized putts per18 holes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoundPuttCounts:
        value.observedRoundPuttCounts as readonly number[],
      observedHolesPlayed: value.observedHolesPlayed as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
