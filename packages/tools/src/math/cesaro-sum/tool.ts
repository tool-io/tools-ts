import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{ readonly seriesTerms: readonly number[] }>;
export type Output = Readonly<{
  readonly ordinaryFinitePartialSum: number;
  readonly cesaroMeanOfPartialSums: number;
}>;
const inputFields = [
  { id: "seriesTerms", label: "Series terms", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.seriesTerms.length || input.seriesTerms.length > 10000)
    simpleError("terms", "Nonempty bounded finite terms required.");
  let s = 0,
    total = 0;
  input.seriesTerms.forEach((v) => {
    s += v;
    total += s;
  });
  return {
    ordinaryFinitePartialSum: s,
    cesaroMeanOfPartialSums: total / input.seriesTerms.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { seriesTerms: [1, -1, 1, -1] } satisfies Input;
export const exampleOutput = {
  ordinaryFinitePartialSum: 0,
  cesaroMeanOfPartialSums: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cesaro-sum",
  title: "Cesàro Sum Calculator",
  description:
    "Compute finite Cesàro mean of successive partial sums from actual series terms, not mean of raw terms or claimed convergence/infinite sum.",
  inputs: inputFields,
  outputs: [
    {
      id: "ordinaryFinitePartialSum",
      label: "Ordinary finite partial sum",
      kind: "number",
    },
    {
      id: "cesaroMeanOfPartialSums",
      label: "Cesaro mean of partial sums",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ seriesTerms: value.seriesTerms as readonly number[] }),
});
export const run = tool.execute;
export default tool;
