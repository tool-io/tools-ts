import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly sequenceLengths: readonly number[];
  readonly correctFlags: readonly number[];
  readonly minimumCorrectTrials: number;
}>;
export type Output = Readonly<{
  readonly qualifiedLengths: readonly number[];
  readonly maximumQualifiedSpan: number;
}>;
const inputFields = [
  { id: "sequenceLengths", label: "Sequence lengths", kind: "numberList" },
  { id: "correctFlags", label: "Correct flags", kind: "numberList" },
  {
    id: "minimumCorrectTrials",
    label: "Minimum correct trials",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sequenceLengths, input.correctFlags, "sequenceLengths");
  input.sequenceLengths.forEach((v) => count(v, "sequenceLengths", 1));
  input.correctFlags.forEach((v) => {
    if (v !== 0 && v !== 1)
      simpleError("correctFlags", "Binary trial outcomes required.");
  });
  count(input.minimumCorrectTrials, "minimumCorrectTrials", 1);
  const totals = new Map<number, number>();
  input.sequenceLengths.forEach((v, i) =>
    totals.set(v, (totals.get(v) ?? 0) + input.correctFlags[i]),
  );
  const qualifiedLengths = [...totals]
    .filter(([, n]) => n >= input.minimumCorrectTrials)
    .map(([v]) => v)
    .sort((a, b) => a - b);
  return {
    qualifiedLengths,
    maximumQualifiedSpan: qualifiedLengths.at(-1) ?? 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sequenceLengths: [3, 3, 4, 4, 5, 5],
  correctFlags: [1, 1, 1, 1, 1, 0],
  minimumCorrectTrials: 2,
} satisfies Input;
export const exampleOutput = {
  qualifiedLengths: [3, 4],
  maximumQualifiedSpan: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/digit-span-trial-score",
  title: "Digit Memory Span",
  description:
    "Score supplied digit-span trials by caller-defined successful-trial count per sequence length; this does not implement a licensed test or normative interpretation.",
  inputs: inputFields,
  outputs: [
    { id: "qualifiedLengths", label: "Qualified lengths", kind: "numberList" },
    {
      id: "maximumQualifiedSpan",
      label: "Maximum qualified span",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequenceLengths: value.sequenceLengths as readonly number[],
      correctFlags: value.correctFlags as readonly number[],
      minimumCorrectTrials: value.minimumCorrectTrials as number,
    }),
});
export const run = tool.execute;
export default tool;
