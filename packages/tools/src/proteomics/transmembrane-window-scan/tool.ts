import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  proteinSequence,
  kyteDoolittleHydropathy,
} from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly windowLength: number;
  readonly minimumMeanHydropathy: number;
}>;
export type Output = Readonly<{
  readonly candidateStarts: readonly number[];
  readonly maximumMeanHydropathy: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.windowLength) ||
    input.windowLength < 1 ||
    input.windowLength > s.length
  )
    simpleError("windowLength", "Valid hydrophobic window length required.");
  const scores = Array.from(
    { length: s.length - input.windowLength + 1 },
    (_, i) =>
      [...s.slice(i, i + input.windowLength)].reduce(
        (sum, v) => sum + kyteDoolittleHydropathy[v],
        0,
      ) / input.windowLength,
  );
  return {
    candidateStarts: scores.flatMap((v, i) =>
      v >= input.minimumMeanHydropathy ? [i] : [],
    ),
    maximumMeanHydropathy: Math.max(...scores),
  };
};
export const exampleInput = {
  sequence: "AAAAAAA",
  windowLength: 4,
  minimumMeanHydropathy: 1.5,
} satisfies Input;
export const exampleOutput = {
  candidateStarts: [0, 1, 2, 3],
  maximumMeanHydropathy: 1.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/transmembrane-window-scan",
  title: "Transmembrane Window Scan",
  description:
    "Detect transmembrane helix candidates from local hydropathy windows.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "windowLength", label: "Window length", kind: "number" },
    {
      id: "minimumMeanHydropathy",
      label: "Minimum mean hydropathy",
      kind: "number",
    },
  ],
  outputs: [
    { id: "candidateStarts", label: "Candidate starts", kind: "numberList" },
    {
      id: "maximumMeanHydropathy",
      label: "Maximum mean hydropathy",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      windowLength: value.windowLength as number,
      minimumMeanHydropathy: value.minimumMeanHydropathy as number,
    }),
});
export const run = tool.execute;
export default tool;
