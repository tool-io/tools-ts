import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly seriesTerms: readonly number[];
  readonly radialWeight: number;
}>;
export type Output = Readonly<{
  readonly finiteAbelWeightedSum: number;
  readonly lastIncludedWeightedTerm: number;
}>;
const inputFields = [
  { id: "seriesTerms", label: "Series terms", kind: "numberList" },
  { id: "radialWeight", label: "Radial weight", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.seriesTerms.length ||
    input.seriesTerms.length > 10000 ||
    input.radialWeight < 0 ||
    input.radialWeight >= 1
  )
    simpleError(
      "parameters",
      "Nonempty bounded terms and r in [0,1) required.",
    );
  let power = 1,
    s = 0,
    last = 0;
  input.seriesTerms.forEach((v) => {
    last = v * power;
    s += last;
    power *= input.radialWeight;
  });
  return { finiteAbelWeightedSum: s, lastIncludedWeightedTerm: last };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seriesTerms: [1, -1, 1, -1],
  radialWeight: 0.5,
} satisfies Input;
export const exampleOutput = {
  finiteAbelWeightedSum: 0.625,
  lastIncludedWeightedTerm: -0.125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/abel-sum",
  title: "Abel Sum Calculator",
  description:
    "Compute finite radial Abel-weighted series Σ a_n r^n for supplied coefficients; no unprovided tail or r→1 limiting summability claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteAbelWeightedSum",
      label: "Finite abel weighted sum",
      kind: "number",
    },
    {
      id: "lastIncludedWeightedTerm",
      label: "Last included weighted term",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      seriesTerms: value.seriesTerms as readonly number[],
      radialWeight: value.radialWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
