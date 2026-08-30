import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly unalteredStrengthsMpa: readonly number[];
  readonly alteredStrengthsMpa: readonly number[];
}>;
export type Output = Readonly<{
  readonly pairedRetainedStrengthFractions: readonly number[];
  readonly pooledRetainedStrengthFraction: number;
  readonly meanPairedWeakeningFraction: number;
}>;
const inputFields = [
  {
    id: "unalteredStrengthsMpa",
    label: "Unaltered strengths mpa",
    kind: "numberList",
  },
  {
    id: "alteredStrengthsMpa",
    label: "Altered strengths mpa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.unalteredStrengthsMpa.forEach((v) =>
    positive(v, "unalteredStrengthsMpa"),
  );
  input.alteredStrengthsMpa.forEach((v) =>
    nonnegative(v, "alteredStrengthsMpa"),
  );
  aligned(
    input.unalteredStrengthsMpa,
    input.alteredStrengthsMpa,
    "unalteredStrengthsMpa",
  );
  const pairedRetainedStrengthFractions = input.alteredStrengthsMpa.map(
    (v, i) => v / input.unalteredStrengthsMpa[i],
  );
  return {
    pairedRetainedStrengthFractions,
    pooledRetainedStrengthFraction:
      input.alteredStrengthsMpa.reduce((a, b) => a + b, 0) /
      input.unalteredStrengthsMpa.reduce((a, b) => a + b, 0),
    meanPairedWeakeningFraction: 1 - mean(pairedRetainedStrengthFractions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unalteredStrengthsMpa: [10, 20],
  alteredStrengthsMpa: [5, 15],
} satisfies Input;
export const exampleOutput = {
  pairedRetainedStrengthFractions: [0.5, 0.75],
  pooledRetainedStrengthFraction: 0.6666666666666666,
  meanPairedWeakeningFraction: 0.375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/hydrothermal-alteration-weakening-factor",
  title: "Hydrothermal Alteration Weakening Factor",
  description:
    "Summarize paired laboratory alteration strength changes with both pooled-strength and unweighted paired conventions; retained fractions above one and negative weakening are preserved, not assumed unsafe flanks.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedRetainedStrengthFractions",
      label: "Paired retained strength fractions",
      kind: "numberList",
    },
    {
      id: "pooledRetainedStrengthFraction",
      label: "Pooled retained strength fraction",
      kind: "number",
    },
    {
      id: "meanPairedWeakeningFraction",
      label: "Mean paired weakening fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      unalteredStrengthsMpa: value.unalteredStrengthsMpa as readonly number[],
      alteredStrengthsMpa: value.alteredStrengthsMpa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
