import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly attackingRank: number;
  readonly defendingRank: number;
}>;
export type Output = Readonly<{
  readonly attackerSurvives: boolean;
  readonly defenderSurvives: boolean;
  readonly defenderFlagCaptured: boolean;
}>;
const inputFields = [
  { id: "attackingRank", label: "Attacking rank", kind: "number" },
  { id: "defendingRank", label: "Defending rank", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.attackingRank, "attacker", 1, 10);
  bounded(input.defendingRank, "defender", 0, 11);
  const a = input.attackingRank,
    d = input.defendingRank,
    win =
      d === 0 ||
      (d === 11 && a === 3) ||
      (a === 1 && d === 10) ||
      (d !== 11 && a > d),
    lose =
      (d === 11 && a !== 3) ||
      (d !== 0 && d !== 11 && !(a === 1 && d === 10) && a < d);
  return {
    attackerSurvives: win,
    defenderSurvives: lose,
    defenderFlagCaptured: d === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  attackingRank: 3,
  defendingRank: 11,
} satisfies Input;
export const exampleOutput = {
  attackerSurvives: true,
  defenderSurvives: false,
  defenderFlagCaptured: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/stratego-rank-resolve-lookup",
  title: "Stratego Rank Resolve Lookup",
  description:
    "Resolve explicit standard Stratego rank convention 1 spy…10 marshal, 11 bomb, 0 flag; only attacking spy beats marshal, miner defuses bomb, equal ranks both removed. Immobile flags/bombs cannot attack.",
  inputs: inputFields,
  outputs: [
    { id: "attackerSurvives", label: "Attacker survives", kind: "boolean" },
    { id: "defenderSurvives", label: "Defender survives", kind: "boolean" },
    {
      id: "defenderFlagCaptured",
      label: "Defender flag captured",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      attackingRank: value.attackingRank as number,
      defendingRank: value.defendingRank as number,
    }),
});
export const run = tool.execute;
export default tool;
