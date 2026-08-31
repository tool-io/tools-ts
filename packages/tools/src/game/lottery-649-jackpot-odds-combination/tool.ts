import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, choose } from "../shared.js";
export type Input = Readonly<{ readonly distinctSixNumberTickets: number }>;
export type Output = Readonly<{
  readonly exactSixOfFortyNineCombinationCount: string;
  readonly coveredDrawProbability: number;
}>;
const inputFields = [
  {
    id: "distinctSixNumberTickets",
    label: "Distinct six number tickets",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.distinctSixNumberTickets, "distinctTickets", 0, 13983816);
  return {
    exactSixOfFortyNineCombinationCount: choose(49, 6).toString(),
    coveredDrawProbability: input.distinctSixNumberTickets / 13983816,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { distinctSixNumberTickets: 2 } satisfies Input;
export const exampleOutput = {
  exactSixOfFortyNineCombinationCount: "13983816",
  coveredDrawProbability: 1.4302247684037032e-7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/lottery-649-jackpot-odds-combination",
  title: "6/49 Jackpot Odds Combination",
  description:
    "Compute fixed unordered six-of-49 jackpot coverage for explicitly distinct tickets and one fair draw; duplicate tickets do not increase coverage, no additional bonus ball/prize tiers or profit implication.",
  inputs: inputFields,
  outputs: [
    {
      id: "exactSixOfFortyNineCombinationCount",
      label: "Exact six of forty nine combination count",
      kind: "string",
    },
    {
      id: "coveredDrawProbability",
      label: "Covered draw probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      distinctSixNumberTickets: value.distinctSixNumberTickets as number,
    }),
});
export const run = tool.execute;
export default tool;
