import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly windowLength: number;
  readonly minimumSerThrFraction: number;
}>;
export type Output = Readonly<{
  readonly candidateStarts: readonly number[];
  readonly maximumSerThrFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.windowLength) ||
    input.windowLength < 1 ||
    input.windowLength > s.length ||
    input.minimumSerThrFraction < 0 ||
    input.minimumSerThrFraction > 1
  )
    simpleError("windowLength", "Valid window and Ser/Thr fraction required.");
  const fractions = Array.from(
    { length: s.length - input.windowLength + 1 },
    (_, i) =>
      [...s.slice(i, i + input.windowLength)].filter(
        (v) => v === "S" || v === "T",
      ).length / input.windowLength,
  );
  return {
    candidateStarts: fractions.flatMap((v, i) =>
      v >= input.minimumSerThrFraction ? [i] : [],
    ),
    maximumSerThrFraction: Math.max(...fractions),
  };
};
export const exampleInput = {
  sequence: "SSSTAA",
  windowLength: 3,
  minimumSerThrFraction: 0.6666666666666666,
} satisfies Input;
export const exampleOutput = {
  candidateStarts: [0, 1, 2],
  maximumSerThrFraction: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/o-glycosylation-windows",
  title: "O Glycosylation Windows",
  description:
    "Find Ser/Thr-rich windows as O-glycosylation context candidates.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "windowLength", label: "Window length", kind: "number" },
    {
      id: "minimumSerThrFraction",
      label: "Minimum ser thr fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "candidateStarts", label: "Candidate starts", kind: "numberList" },
    {
      id: "maximumSerThrFraction",
      label: "Maximum ser thr fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      windowLength: value.windowLength as number,
      minimumSerThrFraction: value.minimumSerThrFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
