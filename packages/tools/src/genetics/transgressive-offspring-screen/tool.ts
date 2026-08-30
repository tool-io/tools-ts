import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstParentValue: number;
  readonly secondParentValue: number;
  readonly offspringValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly belowParentIndexes: readonly number[];
  readonly aboveParentIndexes: readonly number[];
  readonly transgressivePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (!input.offspringValues.length)
    simpleError(
      "offspringValues",
      "At least one offspring measurement required.",
    );
  const low = Math.min(input.firstParentValue, input.secondParentValue),
    high = Math.max(input.firstParentValue, input.secondParentValue),
    belowParentIndexes = input.offspringValues.flatMap((v, i) =>
      v < low ? [i] : [],
    ),
    aboveParentIndexes = input.offspringValues.flatMap((v, i) =>
      v > high ? [i] : [],
    );
  return {
    belowParentIndexes,
    aboveParentIndexes,
    transgressivePercent:
      (100 * (belowParentIndexes.length + aboveParentIndexes.length)) /
      input.offspringValues.length,
  };
};
export const exampleInput = {
  firstParentValue: 10,
  secondParentValue: 20,
  offspringValues: [5, 15, 25],
} satisfies Input;
export const exampleOutput = {
  belowParentIndexes: [0],
  aboveParentIndexes: [2],
  transgressivePercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/transgressive-offspring-screen",
  title: "Transgressive Offspring Screen",
  description:
    "Identify offspring trait measurements outside the two-parent range.",
  inputs: [
    { id: "firstParentValue", label: "First parent value", kind: "number" },
    { id: "secondParentValue", label: "Second parent value", kind: "number" },
    { id: "offspringValues", label: "Offspring values", kind: "numberList" },
  ],
  outputs: [
    {
      id: "belowParentIndexes",
      label: "Below parent indexes",
      kind: "numberList",
    },
    {
      id: "aboveParentIndexes",
      label: "Above parent indexes",
      kind: "numberList",
    },
    {
      id: "transgressivePercent",
      label: "Transgressive percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstParentValue: value.firstParentValue as number,
      secondParentValue: value.secondParentValue as number,
      offspringValues: value.offspringValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
