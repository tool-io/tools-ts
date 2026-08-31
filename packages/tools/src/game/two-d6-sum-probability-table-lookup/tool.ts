import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, bounded } from "../shared.js";
export type Input = Readonly<{ readonly requestedSum: number }>;
export type Output = Readonly<{
  readonly favorableOrderedRollCount: number;
  readonly totalOrderedRollCount: number;
  readonly exactRequestedSumProbability: number;
}>;
const inputFields = [
  { id: "requestedSum", label: "Requested sum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.requestedSum, "sum", 2, 12);
  let n = 0;
  for (let a = 1; a <= 6; a++)
    for (let b = 1; b <= 6; b++) if (a + b === input.requestedSum) n++;
  return {
    favorableOrderedRollCount: n,
    totalOrderedRollCount: 36,
    exactRequestedSumProbability: n / 36,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { requestedSum: 7 } satisfies Input;
export const exampleOutput = {
  favorableOrderedRollCount: 6,
  totalOrderedRollCount: 36,
  exactRequestedSumProbability: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/two-d6-sum-probability-table-lookup",
  title: "2d6 Sum Probability Table",
  description:
    "Enumerate ordered outcomes for two independent fair d6 to resolve exact caller requested sum, not random sampling or mean/variance.",
  inputs: inputFields,
  outputs: [
    {
      id: "favorableOrderedRollCount",
      label: "Favorable ordered roll count",
      kind: "number",
    },
    {
      id: "totalOrderedRollCount",
      label: "Total ordered roll count",
      kind: "number",
    },
    {
      id: "exactRequestedSumProbability",
      label: "Exact requested sum probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ requestedSum: value.requestedSum as number }),
});
export const run = tool.execute;
export default tool;
