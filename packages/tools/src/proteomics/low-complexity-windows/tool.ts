import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly windowLength: number;
  readonly minimumDominantFraction: number;
}>;
export type Output = Readonly<{
  readonly lowComplexityStarts: readonly number[];
  readonly maximumDominantFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.windowLength) ||
    input.windowLength < 1 ||
    input.windowLength > s.length ||
    input.minimumDominantFraction < 0 ||
    input.minimumDominantFraction > 1
  )
    simpleError(
      "windowLength",
      "Valid window length and dominant fraction required.",
    );
  const fractions = Array.from(
    { length: s.length - input.windowLength + 1 },
    (_, i) => {
      const part = s.slice(i, i + input.windowLength),
        counts = [...part].map((c) => [...part].filter((v) => v === c).length);
      return Math.max(...counts) / input.windowLength;
    },
  );
  return {
    lowComplexityStarts: fractions.flatMap((v, i) =>
      v >= input.minimumDominantFraction ? [i] : [],
    ),
    maximumDominantFraction: Math.max(...fractions),
  };
};
export const exampleInput = {
  sequence: "AAAAFG",
  windowLength: 4,
  minimumDominantFraction: 0.75,
} satisfies Input;
export const exampleOutput = {
  lowComplexityStarts: [0, 1],
  maximumDominantFraction: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/low-complexity-windows",
  title: "Low Complexity Windows",
  description: "Detect compositionally biased low-complexity windows.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "windowLength", label: "Window length", kind: "number" },
    {
      id: "minimumDominantFraction",
      label: "Minimum dominant fraction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "lowComplexityStarts",
      label: "Low complexity starts",
      kind: "numberList",
    },
    {
      id: "maximumDominantFraction",
      label: "Maximum dominant fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      windowLength: value.windowLength as number,
      minimumDominantFraction: value.minimumDominantFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
